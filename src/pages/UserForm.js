import React, { useState } from 'react';

function UserForm({ setUsers, users }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email.trim());

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage('❌ Please enter a valid email address.');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase();
        const existingUserIndex = users.findIndex(
            (user) => user.email.trim().toLowerCase() === trimmedEmail
        );

        let updatedUsers;

        if (existingUserIndex !== -1) {
            updatedUsers = [...users];
            updatedUsers[existingUserIndex] = { name, email };
            setMessage(`✅ Updated user with email: ${email}`);
        } else {
            updatedUsers = [...users, { name, email }];
            setMessage(`✅ Added user: ${email}`);
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
            setMessage(`🗑️ Deleted user: ${emailToDelete}`);
        }
    };

    return (
        <section className="card">
            <h2>Create / Update User</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="user-name">Name:</label>
                <input
                    id="user-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                />

                <label htmlFor="user-email">Email:</label>
                <input
                    id="user-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                />

                {message && (
                    <p style={{
                        marginTop: '0.5rem',
                        color: message.includes('✅') ? 'green' : '#cc0000'
                    }}>
                        {message}
                    </p>
                )}

                <button type="submit" className="button-primary">Save</button>
            </form>

            <hr />

            <h3>Existing Users</h3>
            {users.length === 0 ? (
                <p>No users added yet.</p>
            ) : (
                <ul>
                    {users.map((user, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                            <strong>{user.name}</strong> – {user.email}{' '}
                            <button
                                onClick={() => handleDeleteUser(user.email)}
                                style={{
                                    marginLeft: '0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#bb0000',
                                    fontSize: '1rem'
                                }}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default UserForm;
