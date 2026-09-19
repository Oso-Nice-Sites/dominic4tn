CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name_enc` text NOT NULL,
	`email_enc` text NOT NULL,
	`phone_enc` text,
	`message_enc` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_messages_status_created_idx` ON `contact_messages` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `event_rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name_enc` text NOT NULL,
	`email_enc` text NOT NULL,
	`phone_enc` text,
	`guests` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `event_rsvps_event_idx` ON `event_rsvps` (`event_id`);--> statement-breakpoint
CREATE TABLE `export_log` (
	`id` text PRIMARY KEY NOT NULL,
	`exported_by` text NOT NULL,
	`export_type` text NOT NULL,
	`row_count` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `export_log_created_idx` ON `export_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name_enc` text NOT NULL,
	`email_enc` text,
	`phone_enc` text,
	`address_enc` text NOT NULL,
	`sign_count` integer DEFAULT 1 NOT NULL,
	`notes_enc` text,
	`status` text DEFAULT 'new' NOT NULL,
	`exported_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `requests_status_created_idx` ON `requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `volunteers` (
	`id` text PRIMARY KEY NOT NULL,
	`name_enc` text NOT NULL,
	`email_enc` text NOT NULL,
	`phone_enc` text,
	`address_enc` text,
	`interests` text,
	`notes_enc` text,
	`sms_opt_in` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`exported_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `volunteers_status_created_idx` ON `volunteers` (`status`,`created_at`);