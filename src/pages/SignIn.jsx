import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/platform-admin/signin`, null, {
        params: { email, password }
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage('');
    setResetError('');
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('app', 'platform_admin');
      const response = await axios.post(`${API_URL}/api/auth/password-reset-request`, formData);
      setResetMessage(response.data?.message || 'If an account exists, a reset email has been sent.');
    } catch (err) {
      setResetError(err.response?.data?.detail || 'Unable to request password reset. Please try again later.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1>Platform Admin Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
          {error && <div className="error-message">{error}</div>}
          {resetMessage && <div className="info-message">{resetMessage}</div>}
          {resetError && <div className="error-message">{resetError}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <div className="forgot-password">
            <button
              type="button"
              className="link-button"
              onClick={handlePasswordReset}
              disabled={loading || !email}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

