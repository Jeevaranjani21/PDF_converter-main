<?php
// ─── VDart App Configuration ────────────────────────────────────────────────

// ─── Database ────────────────────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'vdart_db');
define('DB_USER', 'root');
define('DB_PASS', '');           // Change to your MySQL password
define('DB_CHARSET', 'utf8mb4');

// ─── SMTP (Gmail example — use App Password if 2FA enabled) ──────────────────
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls');
define('SMTP_USER', 'your-email@gmail.com');   // ← Replace with your email
define('SMTP_PASS', 'your-app-password');       // ← Replace with your App Password
define('SMTP_FROM_NAME', 'VDart Search Web');

// ─── OTP Settings ────────────────────────────────────────────────────────────
define('OTP_EXPIRY_MINUTES', 10);

// ─── App URL (for CORS) ───────────────────────────────────────────────────────
define('FRONTEND_URL', 'http://localhost:5173');
