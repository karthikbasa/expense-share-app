import React, { useState } from 'react';
import { getGroups, saveGroups } from '../utils/storage';

function AddUserToGroupForm({ group, allUsers, onUpdate }) {
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = [
      ...group.users,
      ...allUsers.filter((u) =>
        selectedEmails.includes(u.email) &&
        !group.users.some((gu) => gu.email === u.email)
      ),
    ];

    const groups = getGroups().map((g) =>
      g.name === group.name ? { ...g, users: updatedUsers } : g
    );
    saveGroups(groups); // 💾 custom helper to overwrite GROUP_KEY
    onUpdate(); // 🔁 trigger parent refresh
    setSelectedEmails([]);
  };

  const availableUsers = allUsers.filter(
    (user) => !group.users.some((gu) => gu.email === user.email)
  );

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <label>Add users to this group:</label>
      <br />
      <select
        multiple
        value={selectedEmails}
        onChange={(e) =>
          setSelectedEmails(
            Array.from(e.target.selectedOptions).map((opt) => opt.value)
          )
        }
      >
        {availableUsers.map((user) => (
          <option key={user.email} value={user.email}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <br /><br />
      <button type="submit">Add Users</button>
    </form>
  );
}

export default AddUserToGroupForm;
