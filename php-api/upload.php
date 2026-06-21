<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

withApiHandler(function (): void {
    requireMethod('POST');

    if (!isset($_FILES['image'])) {
        jsonError('Aucun fichier reçu.', 400);
    }

    $url = saveUploadedImage($_FILES['image']);
    jsonResponse(['url' => $url], 201);
});
