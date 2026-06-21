<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

withApiHandler(function (): void {
    requireMethod('POST');

    $body = parseJsonBody();
    $name = trim((string) ($body['name'] ?? ''));
    $email = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');

    if ($name === '') {
        jsonError('Le nom est requis.', 400);
    }
    if (!preg_match(EMAIL_REGEX, $email)) {
        jsonError('Email invalide.', 400);
    }
    if (strlen($password) < 6) {
        jsonError('Le mot de passe doit contenir au moins 6 caractères.', 400);
    }
    if (getUserByEmail($email)) {
        jsonError('Un compte avec cet email existe déjà.', 409);
    }

    $user = createUser($name, $email, $password);
    jsonResponse(['user' => $user], 201);
});
