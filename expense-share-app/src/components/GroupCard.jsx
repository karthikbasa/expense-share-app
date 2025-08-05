import React from 'react';

function GroupCard({ group, onClick }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return '🟢 Active';
      case 'in progress':
        return '🟡 In Progress';
      case 'settled':
        return '⚪ Settled';
      default:
        return '❔ Unknown';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        cursor: 'pointer',
        borderRadius: '8px',
        background: '#f9f9f9',
      }}
      onClick={onClick}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>{group.name}</h3>
      <p>
        <strong>Status:</strong> {getStatusBadge(group.status)}
      </p>

      {group.users?.length > 0 ? (
        <div>
          <strong>Members:</strong>
          <ul style={{ paddingLeft: '1.2rem' }}>
            {group.users.map((user) => (
              <li key={user.email}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p><em>No members assigned.</em></p>
      )}
    </div>
  );
}

export default GroupCard;

