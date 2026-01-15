
CREATE TABLE `merchant` (
  `id` text PRIMARY KEY NOT NULL UNIQUE,
  `name` text NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `deleted_at` text
);

CREATE INDEX `index_1` ON `merchant` (`name`);
