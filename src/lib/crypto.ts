/*
 * Field-level encryption for personal data (names, emails, phones, addresses,
 * free-text notes) using the Web Crypto API — AES-256-GCM. Works unchanged on
 * Cloudflare Workers and in Node 20+; no Buffer or node:crypto.
 *
 * The key is a base64-encoded 32-byte secret supplied by the caller (in the
 * app it comes from a Worker secret, never from source control). Generate one:
 *
 *     openssl rand -base64 32
 *
 * Stored format:   v1.<iv>.<ciphertext+tag>     (base64url segments)
 *
 * - A fresh random 96-bit IV is generated for every call, so encrypting the
 *   same value twice yields different output. Consequently encrypted columns
 *   cannot be searched or de-duplicated in SQL.
 * - The optional `context` string is bound in as GCM additional authenticated
 *   data (e.g. "volunteers.email_enc"). Ciphertext copied into a different
 *   column or table then fails to decrypt instead of decrypting silently.
 * - The `v1` prefix leaves room for key rotation / format changes later.
 *
 * NOTE: the exact format and key handling are inferred; reconcile with
 * Section 2 of the build brief.
 */

const VERSION = "v1";
const IV_BYTES = 12; // 96-bit IV, the recommended size for GCM
const KEY_BYTES = 32; // AES-256

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Importing a key is cheap but not free; cache per key string.
const keyCache = new Map<string, Promise<CryptoKey>>();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Accepts standard base64 or base64url, with or without padding. */
function fromBase64(input: string): Uint8Array<ArrayBuffer> {
  const b64 = input.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function importKey(keyBase64: string): Promise<CryptoKey> {
  let pending = keyCache.get(keyBase64);
  if (!pending) {
    pending = (async () => {
      let raw: Uint8Array<ArrayBuffer>;
      try {
        raw = fromBase64(keyBase64);
      } catch {
        throw new Error("Encryption key is not valid base64.");
      }
      if (raw.length !== KEY_BYTES) {
        throw new Error(
          `Encryption key must be ${KEY_BYTES} bytes (base64 of 32 random bytes); got ${raw.length}.`,
        );
      }
      return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
        "encrypt",
        "decrypt",
      ]);
    })();
    // Don't cache failures (e.g. a mis-set secret that is later fixed).
    pending.catch(() => keyCache.delete(keyBase64));
    keyCache.set(keyBase64, pending);
  }
  return pending;
}

function additionalData(context: string | undefined): { additionalData?: Uint8Array<ArrayBuffer> } {
  if (context === undefined) return {};
  const bytes = encoder.encode(context);
  const copy = new Uint8Array(new ArrayBuffer(bytes.length));
  copy.set(bytes);
  return { additionalData: copy };
}

/** Generate a new random key, base64-encoded, suitable for `encryptField`. */
export function generateEncryptionKey(): string {
  const raw = crypto.getRandomValues(new Uint8Array(KEY_BYTES));
  let binary = "";
  for (const b of raw) binary += String.fromCharCode(b);
  return btoa(binary);
}

/**
 * Encrypt a string field. Returns an opaque `v1.<iv>.<ciphertext>` string safe
 * to store in a TEXT column.
 *
 * @param plaintext  The value to protect.
 * @param keyBase64  Base64 of a 32-byte key (see `generateEncryptionKey`).
 * @param context    Optional label (e.g. "volunteers.email_enc") bound to the
 *                   ciphertext; the same label must be passed to decrypt.
 */
export async function encryptField(
  plaintext: string,
  keyBase64: string,
  context?: string,
): Promise<string> {
  const key = await importKey(keyBase64);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, ...additionalData(context) },
    key,
    encoder.encode(plaintext),
  );
  return `${VERSION}.${toBase64Url(iv)}.${toBase64Url(new Uint8Array(encrypted))}`;
}

/**
 * Decrypt a value produced by `encryptField`. Throws if the format is
 * unrecognised, the key or context is wrong, or the data was tampered with.
 * The error message is deliberately generic and never includes the input.
 */
export async function decryptField(
  stored: string,
  keyBase64: string,
  context?: string,
): Promise<string> {
  const parts = stored.split(".");
  if (parts.length !== 3 || parts[0] !== VERSION) {
    throw new Error("Unable to decrypt field: unrecognised format.");
  }

  const key = await importKey(keyBase64);
  try {
    const iv = fromBase64(parts[1]);
    if (iv.length !== IV_BYTES) throw new Error("bad iv");
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, ...additionalData(context) },
      key,
      fromBase64(parts[2]),
    );
    return decoder.decode(decrypted);
  } catch {
    throw new Error("Unable to decrypt field: wrong key, wrong context, or corrupted data.");
  }
}
