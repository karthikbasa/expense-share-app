import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Account() {
    const [user, setUser] = useState(null);
    const [lastLogin, setLastLogin] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserAndSession = async () => {
            const { data: userData } = await supabase.auth.getUser();
            setUser(userData?.user || null);

            const { data: sessionData } = await supabase.auth.getSession();
            const loginTime = sessionData?.session?.created_at;
            if (loginTime) {
                const formatted = new Date(loginTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                });
                setLastLogin(formatted);
            }
        };

        fetchUserAndSession();
    }, []);

    const handlePasswordReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email);
        if (error) {
            setMessage('Unable to send reset email. Please try again.');
        } else {
            setMessage('Password reset email sent. Check your inbox.');
        }
    };

    if (!user) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                <p>Loading your account details...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
                background: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                marginBottom: '1.5rem'
            }}>
                <p style={{ marginBottom: '0.5rem', color: '#333' }}>
                    <strong>Email:</strong> {user.email}
                </p>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>
                    <strong>Account ID:</strong> {user.id}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={handlePasswordReset}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0077cc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Change Password
                </button>
                {message && (
                    <p style={{ marginTop: '0.5rem', color: '#0077cc' }}>{message}</p>
                )}
            </div>

            <div style={{ marginTop: '2rem', color: '#444' }}>
                <h3 style={{ fontWeight: '500' }}>Account Summary</h3>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                    <li>Groups joined: (coming soon)</li>
                    <li>Expenses tracked: (coming soon)</li>
                    <li>Last login: {lastLogin || 'Unavailable'}</li>
                </ul>
            </div>
        </div>
    );
}
