import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupForm from '../components/GroupForm';
import GroupCard from '../components/GroupCard';
import { getGroups } from '../utils/storage';

function Home({ users }) {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const refreshGroups = () => {
    setGroups(getGroups());
  };

  return (
    <div>
      <h1>Expense Groups</h1>
      <GroupForm onGroupCreated={refreshGroups} allUsers={users} />

      {groups.length === 0 ? (
        <p>No groups created yet.</p>
      ) : (
        groups.map((group) => (
          <GroupCard
            key={group.name}
            group={group}
            onClick={() => navigate(`/group/${group.name}`)}
          />
        ))
      )}

      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users added yet.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
