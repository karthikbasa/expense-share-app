import React from 'react';

function UserList({ users }) {
  const sortedUsers = users
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h2>All Users</h2>
      {sortedUsers.length === 0 ? (
        <p>No users added yet.</p>
      ) : (
        <ul>
          {sortedUsers.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

