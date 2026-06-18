-- AutoPièces Fès — schéma MySQL (phpMyAdmin)
-- Créez la base puis importez ce fichier, ou exécutez dans l'onglet SQL.

CREATE DATABASE IF NOT EXISTS autopiecesfes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE autopiecesfes;

CREATE TABLE IF NOT EXISTS categories (
  slug VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  icon_png TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subcategories (
  slug VARCHAR(191) NOT NULL,
  category_slug VARCHAR(191) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  image_data MEDIUMBLOB,
  image_mime VARCHAR(127),
  PRIMARY KEY (category_slug, slug),
  FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  slug VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  reference VARCHAR(255) DEFAULT '',
  description TEXT,
  category_slug VARCHAR(191) NOT NULL,
  subcategory_slug VARCHAR(191) NOT NULL,
  images JSON NOT NULL,
  compatibility JSON NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
