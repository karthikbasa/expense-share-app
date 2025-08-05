import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Summary from './pages/Summary';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';
import GroupDetail from './pages/GroupDetail'; // ✅ Add this line
import { getUsers, saveUsers } from './utils/storage';

function App() {
  const [users, setUsers] = useState(null); // Start as null
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
      <div style={{ padding: '1rem' }}>
        <Link to="/">🏠 Home</Link> |{' '}
        <Link to="/create-user">➕ Add User</Link> |{' '}
        <Link to="/users">📋 View Users</Link>
      </div>

      <Routes>
        {!isLoading && (
          <>
            <Route path="/" element={<Home users={users} />} />
            <Route
              path="/create-user"
              element={<UserForm setUsers={setUsers} users={users} />}
            />
            <Route path="/users" element={<UserList users={users} />} />
            <Route path="/group/:name" element={<GroupDetail />} /> {/* ✅ New route */}
          </>
        )}
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

