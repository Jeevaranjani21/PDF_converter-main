import { useState, useEffect, useRef } from 'react';
import { verifyOTP, resendOTP } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function OTPModal({ email, context, onClose, onVerified }) {
  const { login } = useAuth();
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [timer, setTimer]       = useState(60 * OTP_COUNTDOWN_MINUTES);
  const inputRefs               = useRef([]);

  const OTP_COUNTDOWN_MINUTES   = 10;

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle single cell input
  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    setError('');
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft'  && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length > 0) {
      const next = Array(6).fill('').map((_, i) => text[i] || '');
      setOtp(next);
      inputRefs.current[Math.min(text.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      const res = await verifyOTP({ email, otp: code });
      const { user, token, message } = res.data;
      if (user && token) login(user, token);
      onVerified(message);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(''); setSuccess('');
    try {
      await resendOTP(email);
      setTimer(60 * 10);
      setOtp(['', '', '', '', '', '']);
      setSuccess('A new code has been sent to your email.');
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const maskedEmail = email.replace(/(.{1})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-logo" style={{ background: 'linear-gradient(135deg,#0A1628,#1A6FFF)' }}>
          ✉
        </div>
        <h2 className="modal-title">Check Your Email</h2>
        <p className="modal-subtitle">
          We sent a 6-digit code to{' '}
          <strong style={{ color: 'var(--navy)' }}>{maskedEmail}</strong>
        </p>

        {error   && <div className="form-error"><span>⚠</span> {error}</div>}
        {success && <div className="form-success">✓ {success}</div>}

        <div className="otp-grid" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              className={`otp-cell ${digit ? 'filled' : ''}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="otp-timer">
          {timer > 0 ? (
            <>Code expires in <span className="highlight">{formatTime(timer)}</span></>
          ) : (
            <>Code expired. <button className="resend-btn" onClick={handleResend}>Resend</button></>
          )}
        </div>
        {timer > 0 && (
          <div className="otp-timer" style={{ marginTop: 8 }}>
            Didn&apos;t receive it?{' '}
            <button className="resend-btn" onClick={handleResend}>Resend code</button>
          </div>
        )}

        <button
          className="form-submit"
          style={{ marginTop: 24 }}
          onClick={handleVerify}
          disabled={loading || otp.join('').length < 6}
        >
          {loading ? 'Verifying…' : 'Verify & Continue →'}
        </button>

        <div className="form-switch" style={{ marginTop: 16 }}>
          <span className="form-link" onClick={onClose}>← Back</span>
        </div>
      </div>
    </div>
  );
}
