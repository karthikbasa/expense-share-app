import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Summary from './pages/Summary';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';
import GroupDetail from './pages/GroupDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import GroupForm from './components/GroupForm';
import Header from './components/Header';
import { getUsers, saveUsers } from './utils/storage';
import Footer from './components/Footer';
import './App.css';

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
        <HashRouter>
            <div className="app-container">
                <Header />

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
                    </Routes>
                </main>

                <Footer />
            </div>
        </HashRouter>
    );
}

export default App;
