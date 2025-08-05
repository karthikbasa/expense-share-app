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

        const trimmedEmail = email.trim().toLowerCase();
        const existingUserIndex = users.findIndex(
            (user) => user.email.trim().toLowerCase() === trimmedEmail
        );

        let updatedUsers;

        if (existingUserIndex !== -1) {
            // Email exists – update user
            updatedUsers = [...users];
            updatedUsers[existingUserIndex] = { name, email };
            setError(`✅ Updated user with email: ${email}`);
        } else {
            // Add new user
            updatedUsers = [...users, { name, email }];
            setError('');
        }

        setUsers(updatedUsers);
        setName('');
        setEmail('');
    };

    const handleDeleteUser = (emailToDelete) => {
        if (window.confirm(`Are you sure you want to delete ${emailToDelete}?`)) {
            const updatedUsers = users.filter(
                (user) => user.email.trim().toLowerCase() !== emailToDelete.trim().toLowerCase()
            );
            setUsers(updatedUsers);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Create / Update User</h2>

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

                {error && <p style={{ color: error.includes('Updated') ? 'green' : 'red' }}>{error}</p>}

                <button type="submit">Save</button>
            </form>

            <hr />

            <h3>Users</h3>
            {users.length === 0 ? (
                <p>No users added yet.</p>
            ) : (
                users.map((user, index) => (
                    <div key={index}>
                        {user.name} ({user.email}){' '}
                        <button onClick={() => handleDeleteUser(user.email)}>🗑️ Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default UserForm;
