<?php

declare(strict_types=1);

function parseJson(mixed $value, array $fallback = []): array
{
    if ($value === null) {
        return $fallback;
    }
    if (is_array($value)) {
        return $value;
    }

    $decoded = json_decode((string) $value, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function subcategoryImageApiPath(string $categorySlug, string $slug): string
{
    $params = http_build_query(['categorySlug' => $categorySlug, 'subSlug' => $slug]);
    return "/api/subcategory-image.php?{$params}";
}

function mapSubcategoryImage(array $row): string
{
    if (!empty($row['image_mime'])) {
        $categorySlug = $row['category_slug'] ?? '';
        return subcategoryImageApiPath($categorySlug, $row['slug']);
    }

    return $row['image'] ?? '';
}

function publicUser(?array $user): ?array
{
    if (!$user) {
        return null;
    }

    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ];
}

function getUserByEmail(string $email): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([strtolower($email)]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function createUser(string $name, string $email, string $password): array
{
    $pdo = getPdo();
    $salt = bin2hex(random_bytes(16));
    $hash = hashPassword($password, $salt);

    $stmt = $pdo->prepare(
        'INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, strtolower($email), $hash, $salt, 'client']);

    $id = (int) $pdo->lastInsertId();
    $user = getUserById($id);
    return publicUser($user) ?? [];
}

function getUserById(int $id): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function verifyCredentials(string $email, string $password): ?array
{
    $user = getUserByEmail($email);
    if (!$user) {
        return null;
    }

    $expected = $user['password_hash'];
    $actual = hashPassword($password, $user['salt']);
    if (!hash_equals($expected, $actual)) {
        return null;
    }

    return publicUser($user);
}

function getCategories(): array
{
    $pdo = getPdo();

    $categories = $pdo->query('SELECT * FROM categories ORDER BY name')->fetchAll();
    $subs = $pdo->query(
        'SELECT slug, category_slug, name, description, image, image_mime FROM subcategories ORDER BY name'
    )->fetchAll();

    $subsByCategory = [];
    foreach ($subs as $sub) {
        $subsByCategory[$sub['category_slug']][] = $sub;
    }

    return array_map(static function (array $category) use ($subsByCategory): array {
        $categorySubs = $subsByCategory[$category['slug']] ?? [];

        return [
            'id' => $category['slug'],
            'name' => $category['name'],
            'slug' => $category['slug'],
            'description' => $category['description'],
            'image' => $category['image'],
            'iconPng' => $category['icon_png'],
            'subcategories' => array_map(static function (array $sub): array {
                return [
                    'id' => $sub['slug'],
                    'name' => $sub['name'],
                    'slug' => $sub['slug'],
                    'description' => $sub['description'] ?? '',
                    'image' => mapSubcategoryImage($sub),
                ];
            }, $categorySubs),
        ];
    }, $categories);
}

function getCategory(string $slug): ?array
{
    foreach (getCategories() as $category) {
        if ($category['slug'] === $slug) {
            return $category;
        }
    }

    return null;
}

function categoryExists(string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT 1 FROM categories WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    return (bool) $stmt->fetch();
}

function insertCategory(array $data): array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'INSERT INTO categories (slug, name, description, image, icon_png) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $data['slug'],
        $data['name'],
        $data['description'],
        $data['image'],
        $data['iconPng'],
    ]);

    return getCategory($data['slug']) ?? [];
}

function updateCategory(string $slug, array $fields): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT * FROM categories WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $current = $stmt->fetch();
    if (!$current) {
        return null;
    }

    $update = $pdo->prepare('UPDATE categories SET name = ?, description = ?, image = ? WHERE slug = ?');
    $update->execute([
        $fields['name'] ?? $current['name'],
        $fields['description'] ?? $current['description'],
        $fields['image'] ?? $current['image'],
        $slug,
    ]);

    return getCategory($slug);
}

function deleteCategory(string $slug): bool
{
    $pdo = getPdo();
    $pdo->prepare('DELETE FROM subcategories WHERE category_slug = ?')->execute([$slug]);
    $stmt = $pdo->prepare('DELETE FROM categories WHERE slug = ?');
    $stmt->execute([$slug]);
    return $stmt->rowCount() > 0;
}

function subcategoryExists(string $categorySlug, string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'SELECT 1 FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1'
    );
    $stmt->execute([$categorySlug, $slug]);
    return (bool) $stmt->fetch();
}

function insertSubcategory(string $categorySlug, array $data): array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'INSERT INTO subcategories (slug, category_slug, name, description, image) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $data['slug'],
        $categorySlug,
        $data['name'],
        $data['description'] ?? '',
        $data['image'] ?? '',
    ]);

    return [
        'id' => $data['slug'],
        'name' => $data['name'],
        'slug' => $data['slug'],
        'description' => $data['description'] ?? '',
        'image' => $data['image'] ?? '',
    ];
}

function getSubcategoryImage(string $categorySlug, string $slug): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'SELECT image_data, image_mime FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1'
    );
    $stmt->execute([$categorySlug, $slug]);
    $row = $stmt->fetch();
    if (!$row || $row['image_data'] === null) {
        return null;
    }

    return [
        'data' => $row['image_data'],
        'mime' => $row['image_mime'] ?: 'application/octet-stream',
    ];
}

function setSubcategoryImage(string $categorySlug, string $slug, string $buffer, string $mime): ?string
{
    $pdo = getPdo();
    $imageUrl = subcategoryImageApiPath($categorySlug, $slug);
    $stmt = $pdo->prepare(
        'UPDATE subcategories SET image_data = ?, image_mime = ?, image = ? WHERE category_slug = ? AND slug = ?'
    );
    $stmt->execute([$buffer, $mime, $imageUrl, $categorySlug, $slug]);

    return $stmt->rowCount() > 0 ? $imageUrl : null;
}

function clearSubcategoryImage(string $categorySlug, string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'UPDATE subcategories SET image_data = NULL, image_mime = NULL, image = ? WHERE category_slug = ? AND slug = ?'
    );
    $stmt->execute(['', $categorySlug, $slug]);
    return $stmt->rowCount() > 0;
}

function updateSubcategory(string $categorySlug, string $slug, array $fields): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'SELECT slug, name, description, image, image_mime FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1'
    );
    $stmt->execute([$categorySlug, $slug]);
    $current = $stmt->fetch();
    if (!$current) {
        return null;
    }

    $name = $fields['name'] ?? $current['name'];
    $description = $fields['description'] ?? $current['description'];

    if (!array_key_exists('image', $fields)) {
        $update = $pdo->prepare(
            'UPDATE subcategories SET name = ?, description = ? WHERE category_slug = ? AND slug = ?'
        );
        $update->execute([$name, $description, $categorySlug, $slug]);

        return [
            'id' => $slug,
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'image' => mapSubcategoryImage([...$current, 'category_slug' => $categorySlug]),
        ];
    }

    $nextImage = trim((string) $fields['image']);
    if ($nextImage === '') {
        $update = $pdo->prepare(
            'UPDATE subcategories SET name = ?, description = ?, image = \'\', image_data = NULL, image_mime = NULL
             WHERE category_slug = ? AND slug = ?'
        );
        $update->execute([$name, $description, $categorySlug, $slug]);

        return [
            'id' => $slug,
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'image' => '',
        ];
    }

    if (str_starts_with($nextImage, '/api/subcategories/') || str_starts_with($nextImage, '/api/subcategory-image.php')) {
        $update = $pdo->prepare(
            'UPDATE subcategories SET name = ?, description = ? WHERE category_slug = ? AND slug = ?'
        );
        $update->execute([$name, $description, $categorySlug, $slug]);

        return [
            'id' => $slug,
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'image' => mapSubcategoryImage([...$current, 'category_slug' => $categorySlug]),
        ];
    }

    $update = $pdo->prepare(
        'UPDATE subcategories SET name = ?, description = ?, image = ?, image_data = NULL, image_mime = NULL
         WHERE category_slug = ? AND slug = ?'
    );
    $update->execute([$name, $description, $nextImage, $categorySlug, $slug]);

    return [
        'id' => $slug,
        'name' => $name,
        'slug' => $slug,
        'description' => $description,
        'image' => $nextImage,
    ];
}

function deleteSubcategory(string $categorySlug, string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('DELETE FROM subcategories WHERE category_slug = ? AND slug = ?');
    $stmt->execute([$categorySlug, $slug]);
    return $stmt->rowCount() > 0;
}

function publicProduct(?array $row): ?array
{
    if (!$row) {
        return null;
    }

    return [
        'id' => $row['slug'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'reference' => $row['reference'] ?? '',
        'description' => $row['description'] ?? '',
        'categorySlug' => $row['category_slug'],
        'subcategorySlug' => $row['subcategory_slug'],
        'images' => parseJson($row['images']),
        'compatibility' => parseJson($row['compatibility']),
        'featured' => (bool) $row['featured'],
    ];
}

function getProducts(): array
{
    $pdo = getPdo();
    $rows = $pdo->query('SELECT * FROM products ORDER BY name')->fetchAll();
    return array_values(array_filter(array_map('publicProduct', $rows)));
}

function getProduct(string $slug): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT * FROM products WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    return publicProduct($stmt->fetch() ?: null);
}

function productExists(string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT 1 FROM products WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    return (bool) $stmt->fetch();
}

function insertProduct(array $data): array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare(
        'INSERT INTO products (slug, name, reference, description, category_slug, subcategory_slug, images, compatibility, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $data['slug'],
        $data['name'],
        $data['reference'] ?? '',
        $data['description'] ?? '',
        $data['categorySlug'],
        $data['subcategorySlug'],
        json_encode($data['images'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        json_encode($data['compatibility'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        !empty($data['featured']) ? 1 : 0,
    ]);

    return getProduct($data['slug']) ?? [];
}

function updateProduct(string $slug, array $fields): ?array
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('SELECT * FROM products WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $current = $stmt->fetch();
    if (!$current) {
        return null;
    }

    $images = array_key_exists('images', $fields)
        ? json_encode($fields['images'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        : $current['images'];

    $compatibility = array_key_exists('compatibility', $fields)
        ? json_encode($fields['compatibility'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        : $current['compatibility'];

    $featured = array_key_exists('featured', $fields)
        ? (!empty($fields['featured']) ? 1 : 0)
        : (int) $current['featured'];

    $update = $pdo->prepare(
        'UPDATE products
         SET name = ?, reference = ?, description = ?, category_slug = ?, subcategory_slug = ?, images = ?, compatibility = ?, featured = ?
         WHERE slug = ?'
    );
    $update->execute([
        $fields['name'] ?? $current['name'],
        $fields['reference'] ?? $current['reference'],
        $fields['description'] ?? $current['description'],
        $fields['categorySlug'] ?? $current['category_slug'],
        $fields['subcategorySlug'] ?? $current['subcategory_slug'],
        $images,
        $compatibility,
        $featured,
        $slug,
    ]);

    return getProduct($slug);
}

function deleteProduct(string $slug): bool
{
    $pdo = getPdo();
    $stmt = $pdo->prepare('DELETE FROM products WHERE slug = ?');
    $stmt->execute([$slug]);
    return $stmt->rowCount() > 0;
}
