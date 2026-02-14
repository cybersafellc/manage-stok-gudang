CREATE TABLE `users` (
  `id` varchar(36) PRIMARY KEY,
  `sap_id` varchar(50) UNIQUE,
  `username` varchar(50) UNIQUE,
  `password` varchar(255),
  `name` varchar(150),
  `jabatan` varchar(100),
  `role` varchar(50),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `category` (
  `id` varchar(36) PRIMARY KEY,
  `category_id` varchar(50) UNIQUE,
  `name` varchar(150) UNIQUE,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `valuation_class` (
  `id` varchar(36) PRIMARY KEY,
  `valuation_class_id` varchar(50) UNIQUE,
  `valuation_description` varchar(200),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `materials` (
  `id` varchar(36) PRIMARY KEY,
  `valuation_class_id` varchar(36),
  `category_id` varchar(36),
  `material_id` varchar(50),
  `material_description` text,
  `satuan` varchar(50),
  `jumlah` float,
  `jumlah_stok_fisik` float,
  `location` varchar(150),
  `barcode` varchar(100),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `history_upload` (
  `id` varchar(36) PRIMARY KEY,
  `keterangan` text,
  `user_id` varchar(36),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `details_upload` (
  `id` varchar(36) PRIMARY KEY,
  `history_upload_id` varchar(36),
  `materials_id` varchar(36),
  `jumlah` float,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `settings` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(100) UNIQUE,
  `status` boolean,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `scan_history` (
  `id` varchar(36) PRIMARY KEY,
  `ip_address` varchar(45),
  `materials_id` varchar(36),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `audit_trails` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(36),
  `details_activity` text,
  `create_at` datetime,
  `update_at` datetime
);

ALTER TABLE `materials` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `history_upload` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `details_upload` ADD FOREIGN KEY (`materials_id`) REFERENCES `materials` (`id`);

ALTER TABLE `details_upload` ADD FOREIGN KEY (`history_upload_id`) REFERENCES `history_upload` (`id`);

ALTER TABLE `scan_history` ADD FOREIGN KEY (`materials_id`) REFERENCES `materials` (`id`);

ALTER TABLE `materials` ADD FOREIGN KEY (`valuation_class_id`) REFERENCES `valuation_class` (`id`);

ALTER TABLE `audit_trails` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
