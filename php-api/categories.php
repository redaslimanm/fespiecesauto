<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        jsonResponse(getCategories());
    }

    if ($method === 'POST') {
        $body = parseJsonBody();
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            jsonError('Le nom est requis.', 400);
        }

        $slug = slugify((string) ($body['slug'] ?? $name));
        if ($slug === '') {
            jsonError('Slug invalide.', 400);
        }
        if (categoryExists($slug)) {
            jsonError('Cette catégorie existe déjà.', 409);
        }

        $category = insertCategory([
            'slug' => $slug,
            'name' => $name,
            'description' => trim((string) ($body['description'] ?? '')),
            'image' => trim((string) ($body['image'] ?? '')),
            'iconPng' => "/categories/icons/{$slug}.png",
        ]);
        jsonResponse($category, 201);
    }

    jsonError('Méthode non autorisée.', 405);
});
