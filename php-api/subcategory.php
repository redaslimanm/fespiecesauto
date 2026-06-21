<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    $slug = getRouteParam('slug');
    $subSlug = getRouteParam('subSlug');
    if (!$slug || !$subSlug) {
        jsonError('Slug requis.', 400);
    }

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'PUT') {
        if (!subcategoryExists($slug, $subSlug)) {
            jsonError('Sous-catégorie introuvable.', 404);
        }

        $body = parseJsonBody();
        $fields = [];

        if (isset($body['name']) && is_string($body['name'])) {
            $name = trim($body['name']);
            if ($name === '') {
                jsonError('Le nom est requis.', 400);
            }
            $fields['name'] = $name;
        }
        if (isset($body['description']) && is_string($body['description'])) {
            $fields['description'] = trim($body['description']);
        }
        if (isset($body['image']) && is_string($body['image'])) {
            $fields['image'] = trim($body['image']);
        }

        $updated = updateSubcategory($slug, $subSlug, $fields);
        jsonResponse($updated);
    }

    if ($method === 'DELETE') {
        if (!deleteSubcategory($slug, $subSlug)) {
            jsonError('Sous-catégorie introuvable.', 404);
        }
        noContent();
    }

    jsonError('Méthode non autorisée.', 405);
});
