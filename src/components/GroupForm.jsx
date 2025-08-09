import React, { useState } from 'react';
import { addGroup, getGroups } from '../utils/storage';

function GroupForm({ onGroupCreated, users }) {
    const [groupName, setGroupName] = useState('');
    const [selectedUserEmails, setSelectedUserEmails] = useState([]);
    const [status, setStatus] = useState('active');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const validUsers = Array.isArray(users) ? users : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedName = groupName.trim();
        if (!trimmedName) {
            setError('Group name is required.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Optional: prevent duplicate group names
            const existingGroups = await getGroups();
            const nameExists = Array.isArray(existingGroups)
                ? existingGroups.some(g => g.name.trim().toLowerCase() === trimmedName.toLowerCase())
                : false;

            if (nameExists) {
                setError('A group with this name already exists.');
                setIsSubmitting(false);
                return;
            }

            await addGroup(trimmedName, selectedUserEmails, status);

            setGroupName('');
            setSelectedUserEmails([]);
            setStatus('active');

            if (onGroupCreated) onGroupCreated();
        } catch (err) {
            console.error('Error creating group:', err);
            setError('Failed to create group. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                    disabled={isSubmitting}
                />

                <label htmlFor="group-users">Select Members:</label>
                {validUsers.length === 0 ? (
                    <p><em>No users available. Add users before creating a group.</em></p>
                ) : (
                    <select
                        id="group-users"
                        multiple
                        value={selectedUserEmails}
                        onChange={handleUserSelect}
                        disabled={isSubmitting}
                    >
                        {validUsers.map(user => (
                            <option key={user.email} value={user.email}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                )}

                <label htmlFor="group-status">Group Status:</label>
                <select
                    id="group-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    disabled={isSubmitting}
                >
                    <option value="active">🟢 Active</option>
                    <option value="in progress">🟡 In Progress</option>
                    <option value="settled">⚪ Settled</option>
                </select>

                {error && <p style={{ color: 'red' }}><strong>{error}</strong></p>}

                <button
                    type="submit"
                    className="button-primary"
                    disabled={validUsers.length === 0 || isSubmitting}
                >
                    {isSubmitting ? 'Creating…' : 'Create Group'}
                </button>
            </form>
        </section>
    );
}

export default GroupForm;
