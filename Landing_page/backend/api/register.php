<?php
// ─── CORS Headers ────────────────────────────────────────────────────────────
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

$fullName = trim($data['full_name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$confirm = $data['confirm_password'] ?? '';

// ─── Validation ──────────────────────────────────────────────────────────────
$errors = [];
if (empty($fullName))
    $errors[] = 'Full name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = 'Invalid email address.';
if (strlen($password) < 8)
    $errors[] = 'Password must be at least 8 characters.';
if ($password !== $confirm)
    $errors[] = 'Passwords do not match.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    $db = getDB();

    // Check duplicate email
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $otpExpiry = date('Y-m-d H:i:s', strtotime('+' . OTP_EXPIRY_MINUTES . ' minutes'));

    $stmt = $db->prepare(
        'INSERT INTO users (full_name, email, password_hash, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$fullName, $email, $passwordHash, $otp, $otpExpiry]);

    // Send OTP email
    $sent = sendOTPEmail($email, $fullName, $otp);
    if (!$sent) {
        // Roll back user creation if email fails
        $db->prepare('DELETE FROM users WHERE email = ?')->execute([$email]);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send verification email. Please try again.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful! Check your email for the verification code.',
        'email' => $email,
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
