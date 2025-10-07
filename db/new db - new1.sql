CREATE TABLE `users` (
  `id` varchar(100) PRIMARY KEY,
  `sap_id` varchar(255) UNIQUE,
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `name` varchar(255),
  `jabatan` varchar(255),
  `role` varchar(255),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `category` (
  `id` varchar(100) PRIMARY KEY,
  `category_id` varchar(25) UNIQUE,
  `name` varchar(255) UNIQUE,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `valuation_class` (
  `id` varchar(100) PRIMARY KEY,
  `valuation_class_id` varchar(100) UNIQUE,
  `valuation_description` varchar(255),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `materials` (
  `id` varchar(100) PRIMARY KEY,
  `valuation_class_id` varchar(100),
  `category_id` varchar(100),
  `material_id` varchar(25),
  `material_description` text,
  `satuan` varchar(75),
  `jumlah` float,
  `jumlah_stok_fisik` float,
  `location` varchar(255),
  `barcode` text,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `history_upload` (
  `id` varchar(100) PRIMARY KEY,
  `keterangan` text,
  `user_id` varchar(100),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `details_upload` (
  `id` varchar(100) PRIMARY KEY,
  `history_upload_id` varchar(100),
  `materials_id` varchar(100),
  `jumlah` float,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `settings` (
  `id` varchar(100) PRIMARY KEY,
  `name` varchar(255) UNIQUE,
  `status` boolean,
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `scan_history` (
  `id` varchar(100) PRIMARY KEY,
  `ip_address` varchar(255),
  `materials_id` varchar(100),
  `create_at` datetime,
  `update_at` datetime
);

CREATE TABLE `audit_trails` (
  `id` varchar(100) PRIMARY KEY,
  `user_id` varchar(100),
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

-- this is insert default data

INSERT INTO `settings` (`id`, `name`, `status`, `create_at`, `update_at`) VALUES (UUID(), 'Pendaftaran Pengguna/User', 1, NOW(), NOW());
INSERT INTO `settings` (`id`, `name`, `status`, `create_at`, `update_at`) VALUES (UUID(), 'Pendaftaran Admin', 1, NOW(), NOW());