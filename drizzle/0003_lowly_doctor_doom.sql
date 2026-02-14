CREATE TABLE `newsletter_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_signups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`url` varchar(500) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_links_platform_unique` UNIQUE(`platform`)
);
