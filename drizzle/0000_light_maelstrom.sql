CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`datetime` text NOT NULL,
	`time_control` text NOT NULL,
	`url` text,
	`description` text,
	`white_player` text NOT NULL,
	`black_player` text NOT NULL,
	`white_rating` integer NOT NULL,
	`black_rating` integer NOT NULL,
	`result` text NOT NULL,
	`termination` text NOT NULL,
	`rating_change_white` integer NOT NULL,
	`rating_change_black` integer NOT NULL,
	`pgn` text,
	FOREIGN KEY (`white_player`) REFERENCES `players`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`black_player`) REFERENCES `players`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `games_datetime_idx` ON `games` (`datetime`);--> statement-breakpoint
CREATE TABLE `players` (
	`name` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`rating` integer NOT NULL
);
