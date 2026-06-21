<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

withApiHandler(function (): void {
    requireMethod('POST');

    $body = parseJsonBody();
    $email = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');

    if ($email === '' || $password === '') {
        jsonError('Email et mot de passe requis.', 400);
    }

    $user = verifyCredentials($email, $password);
    if (!$user) {
        jsonError('Email ou mot de passe incorrect.', 401);
    }

    jsonResponse(['user' => $user]);
});
