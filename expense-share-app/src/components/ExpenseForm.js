import React, { useState } from 'react';
import { addExpenseToGroup } from '../utils/storage';

function ExpenseForm({ group, onExpenseAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && amount && paidBy) {
      const expense = {
        title: title.trim(),
        amount: parseFloat(amount),
        paidBy,
        createdAt: new Date().toISOString(),
      };

      addExpenseToGroup(group.name, expense);
      setTitle('');
      setAmount('');
      setPaidBy('');
      onExpenseAdded(); // refresh parent
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <input
        type="text"
        value={title}
        placeholder="Expense title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br /><br />

      <input
        type="number"
        value={amount}
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <br /><br />

      <label>Paid by:</label>
      <br />
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required>
        <option value="">Select user</option>
        {group.users.map((user) => (
          <option key={user.email} value={user.email}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <br /><br />

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
