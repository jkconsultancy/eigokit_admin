import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { platformAPI } from '../lib/api';
import './Payments.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    platformAPI.getAllPayments().then(data => setPayments(data.payments || []));
  }, []);

  return (
    <div className="payments-page">
      <div className="payments-container">
        <h1>Payment Management</h1>
        <Link to="/dashboard">← Back</Link>
        <div className="payments-list">
          {payments.map(payment => (
            <div key={payment.id} className="payment-card">
              <p>School ID: {payment.school_id}</p>
              <p>Amount: ¥{payment.amount}</p>
              <p>Status: {payment.status}</p>
              <p>Date: {payment.payment_date || payment.created_at}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

