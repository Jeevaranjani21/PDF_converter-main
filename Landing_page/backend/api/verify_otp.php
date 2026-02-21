<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$otp = trim($data['otp'] ?? '');

if (empty($email) || empty($otp)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Email and OTP are required.']);
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, full_name, otp, otp_expires_at FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }

    // Check OTP match
    if ($user['otp'] !== $otp) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Incorrect OTP. Please try again.']);
        exit;
    }

    // Check expiry
    if (strtotime($user['otp_expires_at']) < time()) {
        http_response_code(410);
        echo json_encode(['success' => false, 'message' => 'OTP has expired. Please request a new one.']);
        exit;
    }

    // Mark as verified, clear OTP
    $db->prepare('UPDATE users SET is_verified = 1, otp = NULL, otp_expires_at = NULL WHERE id = ?')
        ->execute([$user['id']]);

    // Simple session token (for production, use JWT)
    $token = bin2hex(random_bytes(32));

    echo json_encode([
        'success' => true,
        'message' => 'Email verified successfully!',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'email' => $email,
        ],
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
