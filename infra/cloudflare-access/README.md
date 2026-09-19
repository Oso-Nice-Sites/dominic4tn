# Cloudflare Access — `/admin/*` (placeholder)

Config only. **Nothing here has been applied** to a Cloudflare account, and the
JSON bodies have not been verified against the live API — check them in the
Zero Trust dashboard before relying on them. There is no admin UI yet; this
reserves the protection so the path is locked down from the day it exists.

| File | Purpose |
| --- | --- |
| `admin-application.json` | Self-hosted Access application covering `dominic4tn.com/admin/*` (hostname is an assumption — change it) |
| `admin-policy.json` | Allow policy listing campaign staff emails (placeholders) |

## Apply (when the Cloudflare account and domain exist)

**Dashboard:** Zero Trust → Access → Applications → Add an application →
Self-hosted. Use the values in the two JSON files (destination
`<your-domain>/admin/*`, an Allow policy on staff emails, 8h sessions).

**API:** with an API token that has *Access: Apps and Policies Edit*:

```bash
export CF_ACCOUNT_ID=...   # Cloudflare account ID
export CF_API_TOKEN=...    # never commit this

# 1. Create the reusable policy; note the returned "id"
curl -sS -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/access/policies" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  --data @infra/cloudflare-access/admin-policy.json

# 2. Create the application, then attach the policy id in its "policies" array
curl -sS -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/access/apps" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  --data @infra/cloudflare-access/admin-application.json
```

(The `_comment` keys are documentation only — delete them from the body if the
API rejects unknown fields.)

## Things to handle before real staff data goes behind this

- **`*.workers.dev`:** the Worker is also reachable at its workers.dev URL,
  where this Access app does not apply. Before launch either disable that
  route (`"workers_dev": false` in `wrangler.jsonc`) or add a second
  destination for it.
- **Defense in depth:** Access injects a signed JWT in the
  `Cf-Access-Jwt-Assertion` header. When the admin routes are built (Section 8
  Day 3+), verify that JWT in the Worker (issuer = your team domain, audience =
  the application's AUD tag) rather than trusting the path alone. The verified
  email is what gets recorded in `export_log.exported_by`.
- **Sanity Studio** (`/studio`) has its own auth and is intentionally not
  covered here.
