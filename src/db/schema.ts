import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/*
 * D1 (SQLite) schema.
 *
 * Convention: any column ending in `_enc` holds ciphertext produced by
 * `encryptField()` in src/lib/crypto.ts (personal data: names, emails, phone
 * numbers, addresses, free-text notes). Everything else — status, counts,
 * timestamps, consent flags — is plaintext so staff can sort and filter.
 * `_enc` columns cannot be searched or sorted in SQL.
 *
 * volunteers / roles / tags / volunteerRoles / volunteerTags / eventRsvps
 * follow the campaign's own ERD (Lucidchart, "Volunteer Database"). Events
 * themselves are NOT modeled here — campaign staff manage events in Sanity;
 * eventRsvps.eventId is a Sanity document ID, not a foreign key.
 *
 * requests, contactMessages, and exportLog are still inferred from the
 * campaign proposal (a separate SQL design for these is in progress) —
 * reconcile those with the build brief before applying to a real database.
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
    // e.g. "S" / "M" / "L" / "XL" — not enforced here; the ERD doesn't define
    // the allowed list, so validate it in the form/API instead.
    shirtSize: text("shirt_size"),
    // Free text for now (e.g. "weekday evenings", "weekends only").
    availability: text("availability"),
    language: text("language"),
    // Allowed values not specified in the ERD — enforce in the API layer.
    status: text("status").notNull().default("new"),
    commitmentType: text("commitment_type"),
    createdAt: createdAt(),
  },
  (t) => [index("volunteers_status_created_idx").on(t.status, t.createdAt)],
);

// How someone can help (e.g. canvassing, phone banking). Not personal data.
export const roles = sqliteTable("roles", {
  id: id(),
  name: text("name").notNull().unique(),
});

// Skills/traits a volunteer has (e.g. bilingual, has a car). Not personal data.
export const tags = sqliteTable("tags", {
  id: id(),
  name: text("name").notNull().unique(),
});

// Junction: which roles each volunteer picked. Composite primary key — a
// volunteer can't be linked to the same role twice.
export const volunteerRoles = sqliteTable(
  "volunteer_roles",
  {
    volunteerId: text("volunteer_id")
      .notNull()
      .references(() => volunteers.id),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
  },
  (t) => [primaryKey({ columns: [t.volunteerId, t.roleId] })],
);

// Junction: which tags apply to each volunteer.
export const volunteerTags = sqliteTable(
  "volunteer_tags",
  {
    volunteerId: text("volunteer_id")
      .notNull()
      .references(() => volunteers.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => [primaryKey({ columns: [t.volunteerId, t.tagId] })],
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
    // Optional: set once a matching/created volunteer record exists. An RSVP
    // doesn't require one — it captures its own name/email either way.
    volunteerId: text("volunteer_id").references(() => volunteers.id),
    nameEnc: text("name_enc").notNull(),
    emailEnc: text("email_enc").notNull(),
    // Whether they'd also like to volunteer, not just attend.
    alsoVolunteer: integer("also_volunteer", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    index("event_rsvps_event_idx").on(t.eventId),
    index("event_rsvps_volunteer_idx").on(t.volunteerId),
  ],
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
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type VolunteerRole = typeof volunteerRoles.$inferSelect;
export type NewVolunteerRole = typeof volunteerRoles.$inferInsert;
export type VolunteerTag = typeof volunteerTags.$inferSelect;
export type NewVolunteerTag = typeof volunteerTags.$inferInsert;
export type YardSignRequest = typeof requests.$inferSelect;
export type NewYardSignRequest = typeof requests.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
export type ExportLogEntry = typeof exportLog.$inferSelect;
export type NewExportLogEntry = typeof exportLog.$inferInsert;
