import React, { useState } from 'react';
import { addGroup } from '../utils/storage';

function GroupForm({ onGroupCreated, allUsers }) {
  const [groupName, setGroupName] = useState('');
  const [selectedUserEmails, setSelectedUserEmails] = useState([]);
  const [status, setStatus] = useState('active');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (groupName.trim()) {
      const selectedUsers = allUsers.filter((user) =>
        selectedUserEmails.includes(user.email)
      );

      addGroup(groupName.trim(), selectedUsers, status); // ✅ now includes status
      setGroupName('');
      setSelectedUserEmails([]);
      setStatus('active');
      onGroupCreated(); // to trigger re-render of list
    }
  }

  const handleUserSelect = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const emails = options.map((opt) => opt.value);
    setSelectedUserEmails(emails);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={groupName}
        placeholder="Enter group name"
        onChange={(e) => setGroupName(e.target.value)}
        required
      />
      <br /><br />

      <label>Select users for this group:</label>
      <br />
      <select multiple value={selectedUserEmails} onChange={handleUserSelect}>
        {allUsers.map((user) => (
          <option key={user.email} value={user.email}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <br /><br />

      <label>Group status:</label>
      <br />
      <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="active">🟢 Active</option>
        <option value="in progress">🟡 In Progress</option>
        <option value="settled">⚪ Settled</option>
      </select>
      <br /><br />

      <button type="submit">Create Group</button>
    </form>
  );
}

export default GroupForm;

