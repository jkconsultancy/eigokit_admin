import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { platformAPI } from '../lib/api';
import './Schools.css';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    contact_info: '',
    account_status: 'trial',
    subscription_tier: 'basic'
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await platformAPI.getSchools();
      setSchools(data.schools || []);
    } catch (err) {
      console.error('Failed to load schools:', err);
      setError(err.response?.data?.detail || 'Failed to load schools. Make sure you are signed in and the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      await platformAPI.createSchool(
        newSchool.name,
        newSchool.contact_info,
        newSchool.account_status,
        newSchool.subscription_tier
      );
      setNewSchool({ name: '', contact_info: '', account_status: 'trial', subscription_tier: 'basic' });
      setShowCreateForm(false);
      loadSchools();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create school');
    }
  };

  const handleStatusChange = async (schoolId, status) => {
    try {
      await platformAPI.updateSchoolStatus(schoolId, status);
      loadSchools();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update school status');
    }
  };

  if (loading) {
    return (
      <div className="schools-page">
        <div className="schools-container">
          <div className="loading">Loading schools...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schools-page">
        <div className="schools-container">
          <div className="error-message">
            <h2>Error Loading Schools</h2>
            <p>{error}</p>
            <button onClick={loadSchools}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schools-page">
      <div className="schools-container">
        <div className="page-header">
          <h1>Manage Schools</h1>
          <Link to="/dashboard">← Back to Dashboard</Link>
        </div>

        <div className="actions-bar">
          <button 
            className="create-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create School'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateSchool} className="create-school-form">
            <h2>Create New School</h2>
            <div className="form-group">
              <label>School Name *</label>
              <input
                type="text"
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                required
                placeholder="Enter school name"
              />
            </div>
            <div className="form-group">
              <label>Contact Info</label>
              <input
                type="text"
                value={newSchool.contact_info}
                onChange={(e) => setNewSchool({ ...newSchool, contact_info: e.target.value })}
                placeholder="Email or phone number"
              />
            </div>
            <div className="form-group">
              <label>Account Status</label>
              <select
                value={newSchool.account_status}
                onChange={(e) => setNewSchool({ ...newSchool, account_status: e.target.value })}
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subscription Tier</label>
              <select
                value={newSchool.subscription_tier}
                onChange={(e) => setNewSchool({ ...newSchool, subscription_tier: e.target.value })}
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Create School</button>
          </form>
        )}

        <div className="schools-list">
          {schools.length === 0 ? (
            <div className="empty-state">
              <p>No schools found. Create your first school to get started.</p>
            </div>
          ) : (
            schools.map(school => (
              <div key={school.id} className="school-card">
                <div className="school-header">
                  <h3>{school.name}</h3>
                  <span className={`status-badge status-${school.account_status}`}>
                    {school.account_status}
                  </span>
                </div>
                <div className="school-info">
                  <p><strong>Contact:</strong> {school.contact_info || 'N/A'}</p>
                  <p><strong>Tier:</strong> {school.subscription_tier}</p>
                  <p><strong>Teachers:</strong> {school.teacher_count || 0}</p>
                  <p><strong>Students:</strong> {school.student_count || 0}</p>
                  <p><strong>Classes:</strong> {school.class_count || 0}</p>
                </div>
                <div className="school-actions">
                  <button 
                    onClick={() => handleStatusChange(school.id, 'active')}
                    className="action-button activate"
                    disabled={school.account_status === 'active'}
                  >
                    Activate
                  </button>
                  <button 
                    onClick={() => handleStatusChange(school.id, 'suspended')}
                    className="action-button suspend"
                    disabled={school.account_status === 'suspended'}
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

