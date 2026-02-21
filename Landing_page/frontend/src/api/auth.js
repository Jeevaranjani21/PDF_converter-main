import axios from 'axios';
import { API_BASE } from '../config';

export const registerUser = (data) =>
  axios.post(`${API_BASE}/register.php`, data);

export const loginUser = (data) =>
  axios.post(`${API_BASE}/login.php`, data);

export const verifyOTP = (data) =>
  axios.post(`${API_BASE}/verify_otp.php`, data);

export const resendOTP = (email) =>
  axios.post(`${API_BASE}/resend_otp.php`, { email });
