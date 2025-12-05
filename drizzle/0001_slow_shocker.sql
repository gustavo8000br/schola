CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`createdBy` int NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT true,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`date` timestamp NOT NULL,
	`present` boolean NOT NULL DEFAULT false,
	`justifiedAbsence` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`subject` varchar(100) NOT NULL,
	`grade` decimal(5,2) NOT NULL,
	`period` varchar(50) NOT NULL,
	`semester` int NOT NULL,
	`year` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`bio` text,
	`achievements` text,
	`extracurricularActivities` text,
	`teacherNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentProfiles_studentId_unique` UNIQUE(`studentId`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`registrationNumber` varchar(50) NOT NULL,
	`dateOfBirth` timestamp,
	`enrollmentDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('active','inactive','graduated') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_registrationNumber_unique` UNIQUE(`registrationNumber`)
);
