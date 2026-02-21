import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import OTPModal from './components/OTPModal';
import './index.css';

export default function App() {
  const [modal, setModal] = useState(null); // 'login' | 'signup' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpContext, setOtpContext] = useState('login'); // 'login' | 'signup'
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openLogin  = () => setModal('login');
  const openSignup = () => setModal('signup');
  const closeModal = () => setModal(null);

  const handleLoginOTP = (email) => {
    setPendingEmail(email);
    setOtpContext('login');
    setModal('otp');
  };

  const handleSignupOTP = (email) => {
    setPendingEmail(email);
    setOtpContext('signup');
    setModal('otp');
  };

  const handleVerified = (message) => {
    closeModal();
    showToast(message || 'Welcome to VDart! You are now signed in.', 'success');
  };

  return (
    <AuthProvider>
      <Navbar onLogin={openLogin} onSignup={openSignup} />
      <LandingPage onGetStarted={openSignup} onExplore={() => {}} />

      {modal === 'login'  && (
        <LoginModal
          onClose={closeModal}
          onOTPRequired={handleLoginOTP}
          onSignup={() => setModal('signup')}
        />
      )}
      {modal === 'signup' && (
        <SignUpModal
          onClose={closeModal}
          onOTPRequired={handleSignupOTP}
          onLogin={() => setModal('login')}
        />
      )}
      {modal === 'otp' && (
        <OTPModal
          email={pendingEmail}
          context={otpContext}
          onClose={closeModal}
          onVerified={handleVerified}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}
    </AuthProvider>
  );
}
