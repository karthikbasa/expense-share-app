import React, { useState } from 'react';

function UserForm({ setUsers, users }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setUsers([...users, { name, email }]);
    setName('');
    setEmail('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>

      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Email:
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <br />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Create</button>
    </form>
  );
}

export default UserForm;
