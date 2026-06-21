<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    requireMethod('POST');

    $slug = getRouteParam('slug');
    if (!$slug) {
        jsonError('Slug requis.', 400);
    }

    $body = parseJsonBody();
    $name = trim((string) ($body['name'] ?? ''));
    if ($name === '') {
        jsonError('Le nom est requis.', 400);
    }
    if (!categoryExists($slug)) {
        jsonError('Catégorie introuvable.', 404);
    }

    $subSlug = slugify((string) ($body['slug'] ?? $name));
    if ($subSlug === '') {
        jsonError('Slug invalide.', 400);
    }
    if (subcategoryExists($slug, $subSlug)) {
        jsonError('Cette sous-catégorie existe déjà.', 409);
    }

    $subcategory = insertSubcategory($slug, [
        'slug' => $subSlug,
        'name' => $name,
        'description' => trim((string) ($body['description'] ?? '')),
        'image' => trim((string) ($body['image'] ?? '')),
    ]);
    jsonResponse($subcategory, 201);
});
