import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import { getGroups } from '../utils/storage';

function Home({ users }) {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setGroups(getGroups());
    }, []);

    return (
        <div className="grid-layout">
            <section className="card">
                <h1>Expense Groups</h1>

                {groups.length === 0 ? (
                    <p>No groups created yet.</p>
                ) : (
                    <div className="grid-layout">
                        {groups.map((group) => (
                            <GroupCard
                                key={group.name}
                                group={group}
                                onClick={() => navigate(`/group/${group.name}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="card">
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
            </section>
        </div>
    );
}

export default Home;
