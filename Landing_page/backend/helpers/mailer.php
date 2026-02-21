<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/app.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Send an OTP verification email
 */
function sendOTPEmail(string $to, string $name, string $otp): bool
{
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port = SMTP_PORT;

        // Recipients
        $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
        $mail->addAddress($to, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your VDart Verification Code';
        $mail->Body = getOTPEmailHTML($name, $otp);
        $mail->AltBody = "Hi $name, your VDart verification code is: $otp — it expires in " . OTP_EXPIRY_MINUTES . " minutes.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("PHPMailer Error: " . $mail->ErrorInfo);
        return false;
    }
}

function getOTPEmailHTML(string $name, string $otp): string
{
    $firstName = explode(' ', $name)[0];
    $expiry = OTP_EXPIRY_MINUTES;
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin:0; padding:0; background:#F0F4FF; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width:560px; margin:40px auto; background:#fff; border-radius:16px;
               overflow:hidden; box-shadow:0 4px 30px rgba(26,111,255,0.12); }
    .header { background: linear-gradient(135deg,#0A1628 0%,#1A3A6F 100%);
              padding:40px 40px 32px; text-align:center; }
    .logo-text { color:#fff; font-size:28px; font-weight:800; letter-spacing:-0.5px; }
    .logo-accent { color:#1A6FFF; }
    .body { padding:40px; }
    h2 { color:#0A1628; font-size:22px; margin:0 0 12px; }
    p { color:#4A5568; font-size:15px; line-height:1.7; margin:0 0 16px; }
    .otp-box { background:#F0F4FF; border:2px dashed #1A6FFF; border-radius:12px;
               text-align:center; padding:28px; margin:28px 0; }
    .otp-code { font-size:42px; font-weight:900; letter-spacing:12px; color:#0A1628;
                font-family: 'Courier New', monospace; }
    .otp-label { color:#718096; font-size:12px; margin-top:8px; }
    .expiry { background:#FFF5F1; border-left:4px solid #FF6B2C; border-radius:4px;
              padding:12px 16px; color:#C05621; font-size:13px; }
    .footer { background:#F7FAFF; padding:24px 40px; text-align:center; color:#A0AEC0; font-size:12px; }
    .footer a { color:#1A6FFF; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-text">V<span class="logo-accent">DART</span></div>
      <div style="color:#8BA4CC; font-size:13px; margin-top:6px;">Search &amp; Talent Solutions</div>
    </div>
    <div class="body">
      <h2>Hi {$firstName},</h2>
      <p>We received a request to verify your VDart account. Use the code below to complete verification:</p>
      <div class="otp-box">
        <div class="otp-code">{$otp}</div>
        <div class="otp-label">One-Time Verification Code</div>
      </div>
      <div class="expiry">⏱ This code expires in <strong>{$expiry} minutes</strong>. Do not share it with anyone.</div>
      <p style="margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      <p>— The VDart Team</p>
    </div>
    <div class="footer">
      &copy; 2024 VDart Inc. All rights reserved.<br>
      <a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
HTML;
}
