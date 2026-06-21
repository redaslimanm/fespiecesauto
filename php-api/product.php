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
        $product = getProduct($slug);
        if (!$product) {
            jsonError('Produit introuvable.', 404);
        }
        jsonResponse($product);
    }

    if ($method === 'PUT') {
        $current = getProduct($slug);
        if (!$current) {
            jsonError('Produit introuvable.', 404);
        }

        $body = parseJsonBody();

        $categorySlug = (isset($body['categorySlug']) && is_string($body['categorySlug']) && trim($body['categorySlug']) !== '')
            ? trim($body['categorySlug'])
            : $current['categorySlug'];
        $subcategorySlug = (isset($body['subcategorySlug']) && is_string($body['subcategorySlug']) && trim($body['subcategorySlug']) !== '')
            ? trim($body['subcategorySlug'])
            : $current['subcategorySlug'];

        if (!categoryExists($categorySlug)) {
            jsonError('Catégorie invalide.', 400);
        }
        if (!subcategoryExists($categorySlug, $subcategorySlug)) {
            jsonError('Sous-catégorie invalide.', 400);
        }

        $fields = [
            'categorySlug' => $categorySlug,
            'subcategorySlug' => $subcategorySlug,
        ];

        if (isset($body['name']) && is_string($body['name'])) {
            $name = trim($body['name']);
            if ($name === '') {
                jsonError('Le nom est requis.', 400);
            }
            $fields['name'] = $name;
        }
        if (isset($body['reference']) && is_string($body['reference'])) {
            $fields['reference'] = trim($body['reference']);
        }
        if (isset($body['description']) && is_string($body['description'])) {
            $fields['description'] = trim($body['description']);
        }
        if (isset($body['images']) && is_array($body['images'])) {
            $fields['images'] = array_values(array_filter(
                $body['images'],
                static fn ($url) => is_string($url) && trim($url) !== ''
            ));
        } elseif (isset($body['image']) && is_string($body['image'])) {
            $fields['images'] = trim($body['image']) !== '' ? [trim($body['image'])] : [];
        }
        if (isset($body['featured']) && is_bool($body['featured'])) {
            $fields['featured'] = $body['featured'];
        }

        $updated = updateProduct($slug, $fields);
        jsonResponse($updated);
    }

    if ($method === 'DELETE') {
        if (!deleteProduct($slug)) {
            jsonError('Produit introuvable.', 404);
        }
        noContent();
    }

    jsonError('Méthode non autorisée.', 405);
});
