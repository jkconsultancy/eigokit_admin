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

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1>Platform Admin Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}

