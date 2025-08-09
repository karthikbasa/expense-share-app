import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroups, getUsers } from '../utils/storage';
import { getGroupSummary } from '../utils/groupMath';
import calculateSettlements from '../utils/settlements';
import ExpenseForm from '../components/ExpenseForm';
import AddUserToGroupForm from '../components/AddUserToGroupForm';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

function GroupDetail() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [version, setVersion] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const groups = await getGroups();
            const foundGroup = Array.isArray(groups)
                ? groups.find((g) =>
                    g.name.trim().toLowerCase() === name.trim().toLowerCase()
                )
                : null;

            setGroup(foundGroup);

            const users = await getUsers();
            setAllUsers(Array.isArray(users) ? users : []);

            if (foundGroup?.id) {
                const { data: inviteData, error: inviteError } = await supabase
                    .from('invites')
                    .select('email, status')
                    .eq('group_id', foundGroup.id);

                if (inviteError) {
                    console.error('Error fetching invites:', inviteError);
                } else {
                    setInvites(inviteData || []);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [name, version]);

    useEffect(() => {
        if (group) console.log("Current group after update:", group);
    }, [group]);

    const refreshGroup = async () => {
        const groups = await getGroups();
        const updated = Array.isArray(groups)
            ? groups.find((g) =>
                g.name.trim().toLowerCase() === name.trim().toLowerCase()
            )
            : null;

        setGroup(updated);
        setVersion((v) => v + 1);
    };

    const handleSettleGroup = () => {
        if (!window.confirm("This will mark the group as settled and lock further edits. Proceed?")) return;

        const groups = JSON.parse(localStorage.getItem("expenseGroups")) || [];
        const now = new Date().toISOString();

        const updatedGroups = groups.map((g) =>
            g.name.trim().toLowerCase() === name.trim().toLowerCase()
                ? { ...g, status: "settled", settledAt: now }
                : g
        );

        localStorage.setItem("expenseGroups", JSON.stringify(updatedGroups));
        setVersion((v) => v + 1);
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'active': return '🟢';
            case 'in progress': return '🟡';
            case 'settled': return '⚪';
            default: return '❔';
        }
    };

    const formatDate = (isoString) => new Date(isoString).toLocaleString();

    const handleViewSummary = () => {
        const safeGroup = {
            ...group,
            users: Array.isArray(group?.users) ? group.users : [],
            expenses: Array.isArray(group?.expenses) ? group.expenses : []
        };

        const summary = getGroupSummary(safeGroup);
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

    if (loading) {
        return <p style={{ padding: '2rem', textAlign: 'center' }}><em>Loading group details…</em></p>;
    }

    if (!group) {
        return <p style={{ padding: '2rem', textAlign: 'center' }}><strong>Group not found.</strong></p>;
    }

    const members = Array.isArray(group.users) ? group.users : [];
    const expenses = Array.isArray(group.expenses) ? group.expenses : [];
    const summary = getGroupSummary({ ...group, users: members, expenses });

    return (
        <div className="grid-layout">
            <section className="card" style={{ padding: '2rem' }}>
                <h2>{group.name}</h2>
                <p><strong>Status:</strong> {getStatusEmoji(group.status)} {group.status}</p>

                {group.status !== "settled" ? (
                    <button onClick={handleSettleGroup} className="button-settle">
                        ✅ Mark Group as Settled
                    </button>
                ) : (
                    <div className="settled-banner">
                        🎉 This group is settled. All expenses are finalized.<br />
                        <small><strong>Settled on:</strong> {formatDate(group.settledAt)}</small>
                    </div>
                )}

                <h3>Members</h3>
                {members.length === 0 ? (
                    <p><em>No members in this group.</em></p>
                ) : (
                    <ul>
                        {members.map((user) => (
                            <li key={user.email}>
                                {user.name} ({user.email})
                            </li>
                        ))}
                    </ul>
                )}

                {invites.length > 0 && (
                    <>
                        <h3>Invited Members</h3>
                        <ul>
                            {invites.map((invite) => (
                                <li key={invite.email}>
                                    {invite.email} — {invite.status === 'pending' ? 'Awaiting signup' : invite.status}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {group.status !== "settled" && (
                    <AddUserToGroupForm
                        group={group}
                        allUsers={allUsers}
                        onUpdate={refreshGroup}
                    />
                )}

                <h3>Expenses</h3>
                {expenses.length > 0 ? (
                    <ul>
                        {expenses.map((expense, index) => (
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
            </section>
        </div>
    );
}

export default GroupDetail;
