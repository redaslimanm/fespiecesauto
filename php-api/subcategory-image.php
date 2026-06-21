<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    $categorySlug = getRouteParam('slug') ?? getRouteParam('categorySlug');
    $subSlug = getRouteParam('subSlug');
    if (!$categorySlug || !$subSlug) {
        jsonError('Paramètres requis.', 400);
    }

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $image = getSubcategoryImage($categorySlug, $subSlug);
        if (!$image) {
            http_response_code(404);
            exit;
        }

        sendCorsHeaders();
        header('Content-Type: ' . $image['mime']);
        header('Cache-Control: public, max-age=86400');
        echo $image['data'];
        exit;
    }

    if ($method === 'PUT') {
        if (!subcategoryExists($categorySlug, $subSlug)) {
            jsonError('Sous-catégorie introuvable.', 404);
        }

        $upload = readImageFromRequest('image');
        $url = setSubcategoryImage($categorySlug, $subSlug, $upload['buffer'], $upload['mime']);
        if (!$url) {
            jsonError('Sous-catégorie introuvable.', 404);
        }
        jsonResponse(['url' => $url]);
    }

    if ($method === 'DELETE') {
        if (!clearSubcategoryImage($categorySlug, $subSlug)) {
            jsonError('Sous-catégorie introuvable.', 404);
        }
        noContent();
    }

    jsonError('Méthode non autorisée.', 405);
});
