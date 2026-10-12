<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration serveur manquante (config.php)']);
    exit;
}
require $configPath;

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Méthode non autorisée']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    respond(400, ['error' => 'Requête invalide']);
}

$email = trim((string) ($input['email'] ?? ''));
$ville = trim((string) ($input['ville'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['error' => 'Email invalide']);
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
    );

    $stmt = $pdo->prepare(
        'INSERT INTO waitlist (email, ville, created_at) VALUES (:email, :ville, NOW())',
    );
    $stmt->execute([
        'email' => $email,
        'ville' => $ville !== '' ? $ville : null,
    ]);
} catch (PDOException $e) {
    respond(500, ['error' => 'Erreur serveur']);
}

respond(200, ['ok' => true]);
