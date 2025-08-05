// src/pages/GroupDetail.js
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

  useEffect(() => {
    const groups = getGroups();
    const foundGroup = groups.find((g) => g.name === name);
    setGroup(foundGroup);

    const loadedUsers = getUsers();
    setAllUsers(loadedUsers);
  }, [name]);

  const refreshGroup = () => {
    const groups = getGroups();
    const updated = groups.find((g) => g.name === name);
    setGroup(updated);
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'in progress': return '🟡';
      case 'settled': return '⚪';
      default: return '❔';
    }
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

      <ExpenseForm group={group} onExpenseAdded={refreshGroup} />

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

