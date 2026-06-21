<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    $slug = getRouteParam('slug');
    if (!$slug) {
        jsonError('Slug requis.', 400);
    }

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $category = getCategory($slug);
        if (!$category) {
            jsonError('Catégorie introuvable.', 404);
        }
        jsonResponse($category);
    }

    if ($method === 'PUT') {
        $body = parseJsonBody();
        $fields = [];

        if (isset($body['name']) && is_string($body['name']) && trim($body['name']) !== '') {
            $fields['name'] = trim($body['name']);
        }
        if (isset($body['description']) && is_string($body['description'])) {
            $fields['description'] = trim($body['description']);
        }
        if (isset($body['image']) && is_string($body['image'])) {
            $fields['image'] = trim($body['image']);
        }

        $updated = updateCategory($slug, $fields);
        if (!$updated) {
            jsonError('Catégorie introuvable.', 404);
        }
        jsonResponse($updated);
    }

    if ($method === 'DELETE') {
        if (!deleteCategory($slug)) {
            jsonError('Catégorie introuvable.', 404);
        }
        noContent();
    }

    jsonError('Méthode non autorisée.', 405);
});
