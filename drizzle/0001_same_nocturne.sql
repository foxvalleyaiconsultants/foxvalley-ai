CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`featuredImage` text,
	`readTime` int NOT NULL,
	`publishedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`authorId` int NOT NULL,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`message` text NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
