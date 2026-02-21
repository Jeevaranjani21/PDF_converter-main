import { useState } from 'react';
import { registerUser } from '../api/auth';

export default function SignUpModal({ onClose, onOTPRequired, onLogin }) {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: ''
  });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      onOTPRequired(form.email);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors ? data.errors.join(' ') : (data?.message || 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-logo">V</div>
        <h2 className="modal-title">Create Account</h2>
        <p className="modal-subtitle">Join VDart and access world-class talent solutions.</p>

        {error && <div className="form-error"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                className="form-input"
                type="text"
                placeholder="John Doe"
                value={form.full_name}
                onChange={update('full_name')}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Work Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                className="form-input"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={update('email')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={update('password')}
                required
                minLength={8}
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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                className="form-input"
                type="password"
                placeholder="Repeat your password"
                value={form.confirm_password}
                onChange={update('confirm_password')}
                required
              />
            </div>
          </div>

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="form-switch">
          Already have an account?{' '}
          <span className="form-link" onClick={onLogin}>Log In</span>
        </div>
      </div>
    </div>
  );
}
