import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/*
 * D1 (SQLite) schema.
 *
 * Convention: any column ending in `_enc` holds ciphertext produced by
 * `encryptField()` in src/lib/crypto.ts (personal data: names, emails, phone
 * numbers, addresses, free-text notes). Everything else — status, counts,
 * timestamps, consent flags — is plaintext so staff can sort and filter.
 * `_enc` columns cannot be searched or sorted in SQL.
 *
 * NOTE: columns are inferred from the campaign proposal (volunteer / yard-sign /
 * contact intake, event RSVPs, VoteBuilder export audit). Reconcile with
 * Section 5 of the build brief before applying to a real database.
 */

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

// Unix seconds; readable back as a Date by Drizzle.
const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const volunteers = sqliteTable(
  "volunteers",
  {
    id: id(),
    nameEnc: text("name_enc").notNull(),
    emailEnc: text("email_enc").notNull(),
    phoneEnc: text("phone_enc"),
    addressEnc: text("address_enc"),
    // What they'd like to help with (e.g. canvassing, phone banking) — not personal data.
    interests: text("interests"),
    notesEnc: text("notes_enc"),
    // Record of SMS consent at sign-up time.
    smsOptIn: integer("sms_opt_in", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["new", "contacted", "active", "inactive"] })
      .notNull()
      .default("new"),
    // Set when included in a VoteBuilder export (see export_log).
    exportedAt: integer("exported_at", { mode: "timestamp" }),
    createdAt: createdAt(),
  },
  (t) => [index("volunteers_status_created_idx").on(t.status, t.createdAt)],
);

// Yard sign requests.
export const requests = sqliteTable(
  "requests",
  {
    id: id(),
    nameEnc: text("name_enc").notNull(),
    emailEnc: text("email_enc"),
    phoneEnc: text("phone_enc"),
    addressEnc: text("address_enc").notNull(),
    signCount: integer("sign_count").notNull().default(1),
    notesEnc: text("notes_enc"),
    status: text("status", { enum: ["new", "scheduled", "delivered", "cancelled"] })
      .notNull()
      .default("new"),
    exportedAt: integer("exported_at", { mode: "timestamp" }),
    createdAt: createdAt(),
  },
  (t) => [index("requests_status_created_idx").on(t.status, t.createdAt)],
);

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: id(),
    nameEnc: text("name_enc").notNull(),
    emailEnc: text("email_enc").notNull(),
    phoneEnc: text("phone_enc"),
    // Message bodies routinely contain personal details, so they are encrypted too.
    messageEnc: text("message_enc").notNull(),
    status: text("status", { enum: ["new", "read", "replied", "archived"] })
      .notNull()
      .default("new"),
    createdAt: createdAt(),
  },
  (t) => [index("contact_messages_status_created_idx").on(t.status, t.createdAt)],
);

export const eventRsvps = sqliteTable(
  "event_rsvps",
  {
    id: id(),
    // ID of the event document in Sanity (events are edited there, not in D1).
    eventId: text("event_id").notNull(),
    nameEnc: text("name_enc").notNull(),
    emailEnc: text("email_enc").notNull(),
    phoneEnc: text("phone_enc"),
    guests: integer("guests").notNull().default(1),
    status: text("status", { enum: ["confirmed", "cancelled"] })
      .notNull()
      .default("confirmed"),
    createdAt: createdAt(),
  },
  (t) => [index("event_rsvps_event_idx").on(t.eventId)],
);

// Audit trail: one row per staff export of readable data (e.g. VoteBuilder CSV).
export const exportLog = sqliteTable(
  "export_log",
  {
    id: id(),
    // Staff identity as asserted by Cloudflare Access.
    exportedBy: text("exported_by").notNull(),
    exportType: text("export_type", { enum: ["volunteers", "requests"] }).notNull(),
    rowCount: integer("row_count").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("export_log_created_idx").on(t.createdAt)],
);

export type Volunteer = typeof volunteers.$inferSelect;
export type NewVolunteer = typeof volunteers.$inferInsert;
export type YardSignRequest = typeof requests.$inferSelect;
export type NewYardSignRequest = typeof requests.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
export type ExportLogEntry = typeof exportLog.$inferSelect;
export type NewExportLogEntry = typeof exportLog.$inferInsert;
