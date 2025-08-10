import React from 'react';

function UserList({ users = [] }) {
    const sortedUsers = users.slice().sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="grid-layout">
            <section className="card">
                <h2>All Users</h2>

                {sortedUsers.length === 0 ? (
                    <p><em>No users added yet. Try creating one to begin.</em></p>
                ) : (
                    <ul>
                        {sortedUsers.map((user, index) => {
                            const isPending = !user.user_id; // user_id is null or undefined
                            return (
                                <li key={index}>
                                    <strong>{user.name}</strong> – {user.email}
                                    {isPending && (
                                        <span style={{ marginLeft: '0.5em', color: '#888' }}>
                                            ⏳ Pending Invite
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default UserList;
