import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function UserForm({ setUsers, users }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email.trim());

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage('❌ Please enter a valid email address.');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase();
        const validUsers = Array.isArray(users) ? users : [];

        const existingUserIndex = validUsers.findIndex(
            (user) => user.email.trim().toLowerCase() === trimmedEmail
        );

        let updatedUsers;

        if (existingUserIndex !== -1) {
            updatedUsers = [...validUsers];
            updatedUsers[existingUserIndex] = { name, email };
            setMessage(`✅ Updated user with email: ${email}`);
        } else {
            updatedUsers = [...validUsers, { name, email }];
            setMessage(`✅ Added user: ${email}`);
        }

        setUsers(updatedUsers);

        // 📨 Step 1: Create invite first
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id;

        if (authError || !currentUserId) {
            console.warn('⚠️ Could not fetch authenticated user for invite.');
            setMessage('⚠️ Failed to fetch current user.');
            return;
        }

        const { error: inviteError } = await supabase
            .from('invites')
            .insert({
                email: trimmedEmail,
                invited_by: currentUserId,
                status: 'pending'
            });

        if (inviteError) {
            console.error('❌ Error inserting invite:', inviteError);
            setMessage('❌ Failed to create invite.');
            return;
        }

        // 👥 Step 2: Insert into members (after invite exists)
        const { error: memberError } = await supabase
            .from('members')
            .upsert(
                {
                    name,
                    email: trimmedEmail,
                    user_id: null // invited user hasn't signed up yet
                    // group_id: optional, if required
                },
                { onConflict: ['email'] }
            );

        if (memberError) {
            console.error('❌ Error inserting into members:', memberError);
            setMessage('❌ Failed to save user to members table.');
            return;
        }

        setName('');
        setEmail('');
    };

    const handleDeleteUser = (emailToDelete) => {
        if (window.confirm(`Are you sure you want to delete ${emailToDelete}?`)) {
            const validUsers = Array.isArray(users) ? users : [];
            const updatedUsers = validUsers.filter(
                (user) => user.email.trim().toLowerCase() !== emailToDelete.trim().toLowerCase()
            );
            setUsers(updatedUsers);
            setMessage(`🗑️ Deleted user: ${emailToDelete}`);
        }
    };

    const validUsers = Array.isArray(users) ? users : [];

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
            {validUsers.length === 0 ? (
                <p><em>No users added yet. Start by entering a name and email.</em></p>
            ) : (
                <ul>
                    {validUsers.map((user, index) => (
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
