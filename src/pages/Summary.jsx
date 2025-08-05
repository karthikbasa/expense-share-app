// src/pages/Summary.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.summary) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Summary</h2>
        <p><em>No group data available. Please return and select a group.</em></p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const { groupName, status, summary, settlements } = state;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Expense Summary for <em>{groupName}</em></h2>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Total Spend:</strong> ₹{summary.totalSpend}</p>
      <p><strong>Equal Share Per Person:</strong> ₹{summary.sharePerUser.toFixed(2)}</p>

      <h3>Individual Balances</h3>
      <ul>
        {summary.balances.map((b) => {
          const status = b.owes > 0
            ? `Owes ₹${b.owes.toFixed(2)}`
            : b.getsBack > 0
            ? `Gets back ₹${b.getsBack.toFixed(2)}`
            : 'Settled';

          return (
            <li key={b.email}>
              {b.name} paid ₹{b.paid}. {status}.
            </li>
          );
        })}
      </ul>

      <h3>Who Owes Whom</h3>
      {settlements.length > 0 ? (
        <ul>
          {settlements.map((line, idx) => <li key={idx}>{line}</li>)}
        </ul>
      ) : (
        <p><em>All expenses are settled.</em></p>
      )}

      <button onClick={() => navigate(-1)}>Back to Group</button>
    </div>
  );
}

export default Summary;

