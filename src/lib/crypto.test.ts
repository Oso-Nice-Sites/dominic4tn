import { describe, expect, it } from "vitest";
import { decryptField, encryptField, generateEncryptionKey } from "./crypto";

const key = generateEncryptionKey();

describe("encryptField / decryptField", () => {
  it("round-trips a value", async () => {
    const plaintext = "jane.doe@example.com";
    const stored = await encryptField(plaintext, key);
    expect(await decryptField(stored, key)).toBe(plaintext);
  });

  it("round-trips unicode, punctuation, newlines and the empty string", async () => {
    for (const value of ["", "José Muñoz-Peña", "日本語 ✓ 🇺🇸", "123 Main St.\nApt #4, Lebanon, TN 37087"]) {
      expect(await decryptField(await encryptField(value, key), key)).toBe(value);
    }
  });

  it("does not store the plaintext and uses the v1 format", async () => {
    const stored = await encryptField("615-555-0100", key);
    expect(stored).not.toContain("615-555-0100");
    expect(stored).toMatch(/^v1\.[\w-]+\.[\w-]+$/);
  });

  it("produces different ciphertext each time (random IV)", async () => {
    const a = await encryptField("same value", key);
    const b = await encryptField("same value", key);
    expect(a).not.toBe(b);
    expect(await decryptField(a, key)).toBe("same value");
    expect(await decryptField(b, key)).toBe("same value");
  });

  it("fails with the wrong key", async () => {
    const stored = await encryptField("secret", key);
    await expect(decryptField(stored, generateEncryptionKey())).rejects.toThrow(/unable to decrypt/i);
  });

  it("fails if the ciphertext was tampered with", async () => {
    const stored = await encryptField("secret", key);
    const [v, iv, ct] = stored.split(".");
    const flipped = ct[0] === "A" ? "B" + ct.slice(1) : "A" + ct.slice(1);
    await expect(decryptField(`${v}.${iv}.${flipped}`, key)).rejects.toThrow(/unable to decrypt/i);
  });

  it("binds ciphertext to its context", async () => {
    const stored = await encryptField("a@b.com", key, "volunteers.email_enc");
    expect(await decryptField(stored, key, "volunteers.email_enc")).toBe("a@b.com");
    await expect(decryptField(stored, key, "requests.email_enc")).rejects.toThrow(/unable to decrypt/i);
    await expect(decryptField(stored, key)).rejects.toThrow(/unable to decrypt/i);
  });

  it("rejects unrecognised formats without echoing the input", async () => {
    for (const bad of ["", "plaintext", "v2.aaaa.bbbb", "v1.only-two"]) {
      await expect(decryptField(bad, key)).rejects.toThrow(/unrecognised format/i);
    }
  });

  it("rejects keys that are not 32 bytes", async () => {
    const short = btoa("too-short");
    await expect(encryptField("x", short)).rejects.toThrow(/32 bytes/);
    await expect(encryptField("x", "!!!not base64!!!")).rejects.toThrow();
  });
});

describe("generateEncryptionKey", () => {
  it("returns base64 of 32 random bytes, different each time", () => {
    const a = generateEncryptionKey();
    expect(atob(a)).toHaveLength(32);
    expect(generateEncryptionKey()).not.toBe(a);
  });
});
