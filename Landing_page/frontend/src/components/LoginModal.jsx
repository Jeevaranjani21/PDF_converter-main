import { useState } from 'react';
import { loginUser } from '../api/auth';

export default function LoginModal({ onClose, onOTPRequired, onSignup }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser({ email, password });
      onOTPRequired(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-logo">V</div>
        <h2 className="modal-title">Welcome Back</h2>
        <p className="modal-subtitle">Enter your credentials to access your workspace.</p>

        {error && (
          <div className="form-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                className="form-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <span className="form-link">Forgot password?</span>
            </div>
            <div className="input-wrapper" style={{ marginTop: 8 }}>
              <span className="input-icon">🔒</span>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', fontSize: 16, color: 'var(--gray-500)'
                }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="form-switch">
          Don&apos;t have an account?{' '}
          <span className="form-link" onClick={onSignup}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}
