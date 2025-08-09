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
import { getUsers, saveUsers } from './utils/storage';
import Account from './pages/Account';

import './App.css';

function App() {
    const [users, setUsers] = useState(null);
    const [session, setSession] = useState(null);
    const isLoading = users === null;

    // Load users from local storage
    useEffect(() => {
        const savedUsers = getUsers();
        setUsers(savedUsers);
    }, []);

    useEffect(() => {
        if (users) {
            saveUsers(users);
        }
    }, [users]);

    // Supabase session listener
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

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

    return (
        <HashRouter>
            <div className="app-container">
                <Header session={session} />

                <main className="main-content">
                    <Routes>
                        {!isLoading && (
                            <>
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
                            </>
                        )}
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
