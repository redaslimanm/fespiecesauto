<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        jsonResponse(getProducts());
    }

    if ($method === 'POST') {
        $body = parseJsonBody();
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            jsonError('Le nom est requis.', 400);
        }

        $categorySlug = trim((string) ($body['categorySlug'] ?? ''));
        $subcategorySlug = trim((string) ($body['subcategorySlug'] ?? ''));
        if ($categorySlug === '' || !categoryExists($categorySlug)) {
            jsonError('Catégorie invalide.', 400);
        }
        if ($subcategorySlug === '' || !subcategoryExists($categorySlug, $subcategorySlug)) {
            jsonError('Sous-catégorie invalide.', 400);
        }

        $slug = slugify((string) ($body['slug'] ?? $name));
        if ($slug === '') {
            jsonError('Slug invalide.', 400);
        }
        if (productExists($slug)) {
            jsonError('Ce produit existe déjà.', 409);
        }

        $images = [];
        if (isset($body['images']) && is_array($body['images'])) {
            $images = array_values(array_filter(
                $body['images'],
                static fn ($url) => is_string($url) && trim($url) !== ''
            ));
        } elseif (isset($body['image']) && is_string($body['image']) && trim($body['image']) !== '') {
            $images = [trim($body['image'])];
        }

        $product = insertProduct([
            'slug' => $slug,
            'name' => $name,
            'reference' => trim((string) ($body['reference'] ?? '')),
            'description' => trim((string) ($body['description'] ?? '')),
            'categorySlug' => $categorySlug,
            'subcategorySlug' => $subcategorySlug,
            'images' => $images,
            'compatibility' => is_array($body['compatibility'] ?? null) ? $body['compatibility'] : [],
            'featured' => !empty($body['featured']),
        ]);
        jsonResponse($product, 201);
    }

    jsonError('Méthode non autorisée.', 405);
});
