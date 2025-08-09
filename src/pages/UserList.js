import React from 'react';

function UserList({ users }) {
    const validUsers = Array.isArray(users) ? users : [];
    const sortedUsers = validUsers.slice().sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return (
        <div className="grid-layout">
            <section className="card">
                <h2>All Users</h2>
                {sortedUsers.length === 0 ? (
                    <p><em>No users added yet. Try creating one to begin.</em></p>
                ) : (
                    <ul>
                        {sortedUsers.map((user, index) => (
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

export default UserList;
