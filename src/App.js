import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Summary from './pages/Summary';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';
import GroupDetail from './pages/GroupDetail';
import Header from './components/Header';
import { getUsers, saveUsers } from './utils/storage';

function App() {
    const [users, setUsers] = useState(null);
    const isLoading = users === null;

    useEffect(() => {
        const savedUsers = getUsers();
        setUsers(savedUsers);
    }, []);

    useEffect(() => {
        if (users) {
            saveUsers(users);
        }
    }, [users]);

    return (
        <BrowserRouter>
            <Header />

            <nav style={{
                padding: '1rem',
                backgroundColor: '#f0f4f8',
                borderBottom: '1px solid #ccc',
                marginBottom: '20px'
            }}>
                <Link to="/" style={{ marginRight: '1rem' }}>🏠 Home</Link>
                <Link to="/create-user" style={{ marginRight: '1rem' }}>➕ Add User</Link>
                <Link to="/users">📋 View Users</Link>
            </nav>

            <Routes>
                {!isLoading && (
                    <>
                        <Route path="/" element={<Home users={users} />} />
                        <Route
                            path="/create-user"
                            element={<UserForm setUsers={setUsers} users={users} />}
                        />
                        <Route path="/users" element={<UserList users={users} />} />
                        <Route path="/group/:name" element={<GroupDetail />} />
                    </>
                )}
                <Route path="/summary" element={<Summary />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
