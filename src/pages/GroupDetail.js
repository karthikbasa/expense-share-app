import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroups, getUsers } from '../utils/storage';
import { getGroupSummary } from '../utils/groupMath';
import calculateSettlements from '../utils/settlements';
import ExpenseForm from '../components/ExpenseForm';
import AddUserToGroupForm from '../components/AddUserToGroupForm';

function GroupDetail() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const groups = getGroups();
        const foundGroup = groups.find((g) =>
            g.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
        setGroup(foundGroup);

        const loadedUsers = getUsers();
        setAllUsers(loadedUsers);

        console.log("Group updated:", groups);
        console.log("Matching group name:", name);
        console.log("Groups loaded:", groups.map(g => g.name));
    }, [name, version]);

    useEffect(() => {
        if (group) {
            console.log("Current group after update:", group);
        }
    }, [group]);

    const refreshGroup = () => {
        const groups = getGroups();
        const updated = groups.find((g) =>
            g.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
        setGroup(updated);
        setVersion((v) => v + 1); // 🆕 trigger UI update
    };

    const handleSettleGroup = () => {
        const confirmed = window.confirm("This will mark the group as settled and lock further edits. Proceed?");
        if (!confirmed) return;

        const groups = getGroups();
        const now = new Date().toISOString();

        const updatedGroups = groups.map((g) => {
            console.log("🧪 Checking group:", g.name);
            if (g.name.trim().toLowerCase() === name.trim().toLowerCase()) {
                console.log("✅ Match found. Updating status to 'settled'.");
                return { ...g, status: "settled", settledAt: now };
            }
            return g;
        });

        console.log("🧾 Groups BEFORE update:", groups);
        console.log("🧾 Groups AFTER update:", updatedGroups);

        localStorage.setItem("expenseGroups", JSON.stringify(updatedGroups));

        const confirmGroups = JSON.parse(localStorage.getItem("expenseGroups"));
        console.log("📦 Stored groups AFTER save:", confirmGroups);
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'active': return '🟢';
            case 'in progress': return '🟡';
            case 'settled': return '⚪';
            default: return '❔';
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    const handleViewSummary = () => {
        const summary = getGroupSummary(group);
        const settlements = calculateSettlements(
            Object.fromEntries(summary.balances.map(b => [b.name, b.paid]))
        );

        navigate('/summary', {
            state: {
                groupName: group.name,
                status: group.status,
                settledAt: group.settledAt,
                summary,
                settlements
            }
        });
    };

    if (!group) return <p>Group not found.</p>;

    const summary = getGroupSummary(group);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{group.name}</h2>
            <p><strong>Status:</strong> {getStatusEmoji(group.status)} {group.status}</p>

            {group.status !== "settled" && (
                <button
                    onClick={handleSettleGroup}
                    style={{
                        marginBottom: "1rem",
                        backgroundColor: "#f0f0f0",
                        padding: "0.5rem 1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    ✅ Mark Group as Settled
                </button>
            )}

            {group.status === "settled" && (
                <div style={{ marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#e0e0e0", borderRadius: "4px", color: "#333" }}>
                    🎉 This group is settled. All expenses are finalized.<br />
                    <small><strong>Settled on:</strong> {formatDate(group.settledAt)}</small>
                </div>
            )}

            <h3>Members</h3>
            {group.users.length === 0 ? (
                <p><em>No members in this group.</em></p>
            ) : (
                <ul>
                    {group.users.map((user) => (
                        <li key={user.email}>
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}

            <AddUserToGroupForm
                group={group}
                allUsers={allUsers}
                onUpdate={refreshGroup}
            />

            <h3>Expenses</h3>
            {group.expenses?.length > 0 ? (
                <ul>
                    {group.expenses.map((expense, index) => (
                        <li key={index}>
                            <strong>{expense.title}</strong> — ₹{expense.amount} by {expense.paidBy}
                        </li>
                    ))}
                </ul>
            ) : (
                <p><em>No expenses added yet.</em></p>
            )}

            {group.status !== "settled" ? (
                <ExpenseForm group={group} onExpenseAdded={refreshGroup} />
            ) : (
                <p><em>Expense entry disabled for settled groups.</em></p>
            )}

            <h3>Group Summary</h3>
            <p><strong>Total Spend:</strong> ₹{summary.totalSpend}</p>
            <p><strong>Equal Share:</strong> ₹{summary.sharePerUser.toFixed(2)}</p>

            <ul>
                {summary.balances.map((b) => (
                    <li key={b.email}>
                        {b.name} paid ₹{b.paid}.
                        {b.owes > 0 && ` Owes ₹${b.owes.toFixed(2)}.`}
                        {b.getsBack > 0 && ` Gets back ₹${b.getsBack.toFixed(2)}.`}
                        {b.owes === 0 && b.getsBack === 0 && ` Settled.`}
                    </li>
                ))}
            </ul>

            <button onClick={handleViewSummary}>View Full Summary</button>
        </div>
    );
}

export default GroupDetail;