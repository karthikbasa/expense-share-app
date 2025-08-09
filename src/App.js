import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import Home from './pages/Home';
import Summary from './pages/Summary';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';
import GroupDetail from './pages/GroupDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import GroupForm from './components/GroupForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Account from './pages/Account';

import './App.css';

function App() {
    const [session, setSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Session listener
    useEffect(() => {
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load users from Supabase
    useEffect(() => {
        const fetchUsers = async () => {
            if (!session) return;

            try {
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) throw error;

                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error loading users:', err.message);
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [session]);

    if (!session) {
        return (
            <div className="auth-wrapper">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google', 'github']}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <main className="main-content">
                <p style={{ padding: '2rem', textAlign: 'center' }}>
                    <em>Loading users…</em>
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="main-content">
                <p style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                    {error}
                </p>
            </main>
        );
    }

    return (
        <HashRouter>
            <div className="app-container">
                <Header session={session} />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home users={users} />} />
                        <Route
                            path="/create-user"
                            element={<UserForm setUsers={setUsers} users={users} />}
                        />
                        <Route
                            path="/create-group"
                            element={<GroupForm users={users} />}
                        />
                        <Route path="/view-users" element={<UserList users={users} />} />
                        <Route path="/group/:name" element={<GroupDetail />} />
                        <Route path="/summary" element={<Summary />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/account" element={<Account />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </HashRouter>
    );
}

export default App;
