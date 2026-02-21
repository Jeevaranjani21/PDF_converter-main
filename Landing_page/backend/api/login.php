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
require_once __DIR__ . '/../helpers/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, full_name, password_hash, is_verified FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Use constant-time comparison to avoid user enumeration
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }

    // Generate fresh OTP
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $otpExpiry = date('Y-m-d H:i:s', strtotime('+' . OTP_EXPIRY_MINUTES . ' minutes'));

    $db->prepare('UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?')
        ->execute([$otp, $otpExpiry, $user['id']]);

    $sent = sendOTPEmail($email, $user['full_name'], $otp);
    if (!$sent) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send verification email.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'OTP sent to your email.',
        'email' => $email,
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
