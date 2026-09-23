ALTER TABLE `volunteers` DROP COLUMN `address_enc`;
--> statement-breakpoint
ALTER TABLE `volunteers` DROP COLUMN `interests`;
--> statement-breakpoint
ALTER TABLE `volunteers` DROP COLUMN `notes_enc`;
--> statement-breakpoint
ALTER TABLE `volunteers` DROP COLUMN `sms_opt_in`;
--> statement-breakpoint
ALTER TABLE `volunteers` DROP COLUMN `exported_at`;
--> statement-breakpoint
ALTER TABLE `volunteers` ADD `shirt_size` text;
--> statement-breakpoint
ALTER TABLE `volunteers` ADD `availability` text;
--> statement-breakpoint
ALTER TABLE `volunteers` ADD `language` text;
--> statement-breakpoint
ALTER TABLE `volunteers` ADD `commitment_type` text;
--> statement-breakpoint
ALTER TABLE `event_rsvps` DROP COLUMN `phone_enc`;
--> statement-breakpoint
ALTER TABLE `event_rsvps` DROP COLUMN `guests`;
--> statement-breakpoint
ALTER TABLE `event_rsvps` DROP COLUMN `status`;
--> statement-breakpoint
ALTER TABLE `event_rsvps` ADD `volunteer_id` text REFERENCES volunteers(id);
--> statement-breakpoint
ALTER TABLE `event_rsvps` ADD `also_volunteer` integer DEFAULT false NOT NULL;
--> statement-breakpoint
CREATE INDEX `event_rsvps_volunteer_idx` ON `event_rsvps` (`volunteer_id`);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);
--> statement-breakpoint
CREATE TABLE `volunteer_roles` (
	`volunteer_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`volunteer_id`, `role_id`),
	FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `volunteer_tags` (
	`volunteer_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`volunteer_id`, `tag_id`),
	FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
