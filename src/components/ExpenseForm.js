import React, { useState } from 'react';
import { addExpenseToGroup } from '../utils/storage';

function ExpenseForm({ group, onExpenseAdded }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState('');

    if (!group || !group.users || group.users.length === 0) {
        return (
            <div className="empty-state">
                <p>No group selected or no users available.</p>
                <p>Please create a group and add users to begin tracking expenses.</p>
            </div>
        );
    }

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
        <form onSubmit={handleSubmit} className="expense-form">
            <label>Title</label>
            <input
                type="text"
                value={title}
                placeholder="e.g. Dinner at Blue Sky"
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            {title.trim() === '' && <span className="form-hint">Title is required.</span>}

            <label>Amount</label>
            <input
                type="number"
                value={amount}
                placeholder="e.g. 1200"
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            {!amount && <span className="form-hint">Amount is required.</span>}

            <label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required>
                <option value="">Select user</option>
                {group.users.map((user) => (
                    <option key={user.email} value={user.email}>
                        {user.name} ({user.email})
                    </option>
                ))}
            </select>
            {!paidBy && <span className="form-hint">Please select who paid.</span>}

            <button type="submit">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;