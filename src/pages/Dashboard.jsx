import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { platformAPI } from '../lib/api';
import './Dashboard.css';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformAPI.getDashboard()
      .then(setDashboard)
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setError(err.message || 'Failed to connect to API. Make sure the backend is running on http://localhost:8000');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-message">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <p>Please check:</p>
            <ul>
              <li>Backend server is running: <code>uvicorn app.main:app --reload</code></li>
              <li>API URL is correct in <code>.env</code> file</li>
              <li>CORS is configured in the backend</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Platform Admin Dashboard</h1>
        <nav>
          <Link to="/schools">Manage Schools</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/features">Feature Flags</Link>
        </nav>
        <div className="metrics">
          <div className="metric-card">
            <h3>Total Schools</h3>
            <p>{dashboard.platform_level?.total_schools || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Active Schools</h3>
            <p>{dashboard.platform_level?.active_schools || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Total Students</h3>
            <p>{dashboard.platform_level?.total_students || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Total Revenue</h3>
            <p>¥{dashboard.platform_level?.total_revenue || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

