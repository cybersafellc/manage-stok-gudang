CREATE TABLE `users` (
  `id` varchar(100) PRIMARY KEY,
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `name` varchar(255),
  `id_karyawan` varchar(255) UNIQUE,
  `jabatan` varchar(255),
  `role` varchar(255),
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `category` (
  `id` varchar(100) PRIMARY KEY,
  `category_id` varchar(25) UNIQUE,
  `name` varchar(255) UNIQUE,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `materials` (
  `id` varchar(100) PRIMARY KEY,
  `category_id` varchar(100),
  `material_id` varchar(25) UNIQUE,
  `material_description` text,
  `satuan` varchar(75),
  `jumlah` float,
  `barcode` text,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `history_upload` (
  `id` varchar(100) PRIMARY KEY,
  `keterangan` text,
  `user_id` varchar(100),
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `details_upload` (
  `id` varchar(100) PRIMARY KEY,
  `history_upload_id` varchar(100),
  `materials_id` varchar(100),
  `jumlah` float,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `settings` (
  `id` varchar(100) PRIMARY KEY,
  `name` varchar(255) UNIQUE,
  `status` boolean,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `scan_history` (
  `id` varchar(100) PRIMARY KEY,
  `ip_address` varchar(255),
  `materials_id` varchar(100),
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `materials` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `history_upload` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `details_upload` ADD FOREIGN KEY (`materials_id`) REFERENCES `materials` (`id`);

ALTER TABLE `details_upload` ADD FOREIGN KEY (`history_upload_id`) REFERENCES `history_upload` (`id`);

ALTER TABLE `materials` ADD FOREIGN KEY (`id`) REFERENCES `scan_history` (`materials_id`);

-- this is insert default data

INSERT INTO `settings` (`id`, `name`, `status`, `create_at`, `update_at`) VALUES (UUID(), 'Pendaftaran Pengguna/User', 1, NOW(), NOW());