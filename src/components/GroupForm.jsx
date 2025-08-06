import React, { useState } from 'react';
import { addGroup } from '../utils/storage';

function GroupForm({ onGroupCreated, users }) {
    const [groupName, setGroupName] = useState('');
    const [selectedUserEmails, setSelectedUserEmails] = useState([]);
    const [status, setStatus] = useState('active');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        const selectedUsers = users.filter(user =>
            selectedUserEmails.includes(user.email)
        );

        addGroup(groupName.trim(), selectedUsers, status);
        setGroupName('');
        setSelectedUserEmails([]);
        setStatus('active');
        if (onGroupCreated) onGroupCreated(); // optional callback
    };

    const handleUserSelect = (e) => {
        const emails = Array.from(e.target.selectedOptions, opt => opt.value);
        setSelectedUserEmails(emails);
    };

    return (
        <section className="card">
            <h2>Create Expense Group</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="group-name">Group Name:</label>
                <input
                    id="group-name"
                    type="text"
                    value={groupName}
                    placeholder="Enter group name"
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />

                <label htmlFor="group-users">Select Members:</label>
                <select
                    id="group-users"
                    multiple
                    value={selectedUserEmails}
                    onChange={handleUserSelect}
                >
                    {users.map(user => (
                        <option key={user.email} value={user.email}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                <label htmlFor="group-status">Group Status:</label>
                <select
                    id="group-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="active">🟢 Active</option>
                    <option value="in progress">🟡 In Progress</option>
                    <option value="settled">⚪ Settled</option>
                </select>

                <button type="submit" className="button-primary">Create Group</button>
            </form>
        </section>
    );
}

export default GroupForm;