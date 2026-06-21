<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * @return PDO
 */
function getPdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env('DB_HOST', 'localhost');
    $port = env('DB_PORT', '3306');
    $user = env('DB_USER', 'root');
    $password = env('DB_PASSWORD', '');
    $database = env('DB_NAME', 'autopiecesfes');

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function ensureDatabaseSchema(): void
{
    static $initialized = false;
    if ($initialized) {
        return;
    }
    $initialized = true;

    $pdo = getPdo();

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            slug VARCHAR(191) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            image TEXT,
            icon_png TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $pdo->exec("
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    ensureSubcategoryImageColumns($pdo);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL DEFAULT '',
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            salt VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'client',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $pdo->exec("
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    seedAdminUser($pdo);
}

function ensureSubcategoryImageColumns(PDO $pdo): void
{
    $stmt = $pdo->query("SHOW COLUMNS FROM subcategories LIKE 'image_data'");
    if ($stmt && $stmt->fetch()) {
        return;
    }

    $pdo->exec('ALTER TABLE subcategories ADD COLUMN image_data MEDIUMBLOB NULL AFTER image');
    $pdo->exec('ALTER TABLE subcategories ADD COLUMN image_mime VARCHAR(127) NULL AFTER image_data');
}

function seedAdminUser(PDO $pdo): void
{
    $email = strtolower(env('ADMIN_EMAIL', 'otman@gmail.com') ?? 'otman@gmail.com');
    $password = env('ADMIN_PASSWORD', 'otman2005') ?? 'otman2005';
    $name = env('ADMIN_NAME', 'Otman') ?? 'Otman';

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        return;
    }

    $salt = bin2hex(random_bytes(16));
    $hash = hashPassword($password, $salt);

    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)'
    );
    $insert->execute([$name, $email, $hash, $salt, 'admin']);
}
