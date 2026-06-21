<?php

declare(strict_types=1);

const EMAIL_REGEX = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';

const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function sendCorsHeaders(): void
{
    $origin = env('CORS_ORIGIN');
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

function handlePreflight(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        sendCorsHeaders();
        http_response_code(204);
        exit;
    }
}

function jsonResponse(mixed $data, int $status = 200): void
{
    sendCorsHeaders();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonError(string $message, int $status = 500): void
{
    jsonResponse(['error' => $message], $status);
}

function noContent(): void
{
    sendCorsHeaders();
    http_response_code(204);
    exit;
}

function parseJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function withApiHandler(callable $handler): void
{
    try {
        ensureDatabaseSchema();
        $handler();
    } catch (Throwable $err) {
        error_log($err->getMessage());
        $message = $err->getMessage();
        if (str_contains($message, 'Format d') || str_contains($message, 'fichier')) {
            jsonError($message, 400);
        }
        jsonError('Erreur serveur.', 500);
    }
}

function slugify(string $value): string
{
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-');
}

/**
 * Match Node.js crypto.scryptSync(password, salt, 64) for existing user passwords.
 */
function hashPassword(string $password, string $salt): string
{
    if (!in_array('scrypt', hash_algos(), true)) {
        throw new RuntimeException('L\'algorithme scrypt n\'est pas disponible sur ce serveur.');
    }

    return hash('scrypt', $password, [
        'n' => 16384,
        'r' => 8,
        'p' => 1,
        'salt' => $salt,
    ]);
}

function getUploadsDir(): string
{
    $custom = env('UPLOADS_DIR');
    if ($custom) {
        return $custom;
    }

    return dirname(__DIR__) . '/public/uploads';
}

function validateImageFile(array $file): void
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Aucun fichier reçu.');
    }

    $type = $file['type'] ?? '';
    if (!in_array($type, ALLOWED_IMAGE_TYPES, true)) {
        throw new RuntimeException("Format d'image non supporté.");
    }

    if (($file['size'] ?? 0) > MAX_FILE_SIZE) {
        throw new RuntimeException('Fichier trop volumineux (max 5 Mo).');
    }
}

function saveUploadedImage(array $file): string
{
    validateImageFile($file);

    $uploadsDir = getUploadsDir();
    if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
        throw new RuntimeException('Impossible de créer le dossier uploads.');
    }

    $original = $file['name'] ?? 'image.png';
    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION)) ?: 'png';
    $base = slugify(pathinfo($original, PATHINFO_FILENAME)) ?: 'image';
    $filename = $base . '-' . (string) round(microtime(true) * 1000) . '.' . $ext;
    $target = $uploadsDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        throw new RuntimeException("Échec de l'enregistrement du fichier.");
    }

    return '/uploads/' . $filename;
}

function readImageFromRequest(string $fieldName = 'image'): array
{
    if (!isset($_FILES[$fieldName])) {
        throw new RuntimeException('Aucun fichier reçu.');
    }

    validateImageFile($_FILES[$fieldName]);
    $buffer = file_get_contents($_FILES[$fieldName]['tmp_name']);
    if ($buffer === false) {
        throw new RuntimeException('Impossible de lire le fichier.');
    }

    return [
        'buffer' => $buffer,
        'mime' => $_FILES[$fieldName]['type'] ?? 'application/octet-stream',
    ];
}

function requireMethod(string ...$allowed): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $allowed, true)) {
        jsonError('Méthode non autorisée.', 405);
    }
}

function getRouteParam(string $key): ?string
{
    $value = $_GET[$key] ?? null;
    if (!is_string($value) || $value === '') {
        return null;
    }

    return $value;
}
