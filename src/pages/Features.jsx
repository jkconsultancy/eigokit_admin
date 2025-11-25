import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { platformAPI } from '../lib/api';
import './Features.css';

export default function Features() {
  const [schoolId, setSchoolId] = useState('');
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ feature_name: '', enabled: false });

  const loadFeatures = async () => {
    if (!schoolId) return;
    const data = await platformAPI.getSchoolFeatures(schoolId);
    setFeatures(data.features || []);
  };

  const handleSetFeature = async () => {
    await platformAPI.setFeatureFlag(schoolId, newFeature);
    loadFeatures();
  };

  return (
    <div className="features-page">
      <div className="features-container">
        <h1>Feature Flags</h1>
        <Link to="/dashboard">← Back</Link>
        <div className="feature-controls">
          <input
            type="text"
            placeholder="School ID"
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
          />
          <button onClick={loadFeatures}>Load Features</button>
        </div>
        {features.length > 0 && (
          <div className="features-list">
            {features.map(f => (
              <div key={f.id} className="feature-card">
                <h3>{f.feature_name}</h3>
                <p>Enabled: {f.enabled ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        )}
        <div className="add-feature">
          <input
            type="text"
            placeholder="Feature Name"
            value={newFeature.feature_name}
            onChange={e => setNewFeature({...newFeature, feature_name: e.target.value})}
          />
          <label>
            <input
              type="checkbox"
              checked={newFeature.enabled}
              onChange={e => setNewFeature({...newFeature, enabled: e.target.checked})}
            />
            Enabled
          </label>
          <button onClick={handleSetFeature}>Set Feature</button>
        </div>
      </div>
    </div>
  );
}

