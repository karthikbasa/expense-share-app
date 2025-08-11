import React, { useState } from 'react';
import { addExpenseToGroup } from '../utils/storage'; // ✅ using your storage file

function ExpenseForm({ group, onExpenseAdded }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const safeUsers = Array.isArray(group?.users) ? group.users : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedTitle = title.trim();
        const parsedAmount = parseFloat(amount);

        if (!trimmedTitle || !parsedAmount || parsedAmount <= 0 || !paidBy) {
            setError('Please enter valid expense details.');
            return;
        }

        setIsSubmitting(true);

        try {
            //const paidUser = safeUsers.find(u => u.email === paidBy);
            //const paidByName = paidUser?.name || paidBy;

            const expense = {
                title: trimmedTitle,
                amount: parsedAmount,
                paid_by: paidBy
            };

            // ✅ Pass group.id instead of group.name
            await addExpenseToGroup(group.id, expense);

            setTitle('');
            setAmount('');
            setPaidBy('');
            if (onExpenseAdded) onExpenseAdded();
        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Failed to add expense. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                disabled={isSubmitting}
            />
            <br /><br />

            <input
                type="number"
                value={amount}
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                disabled={isSubmitting}
            />
            <br /><br />

            <label htmlFor="paid-by">Paid by:</label>
            <br />
            <select
                id="paid-by"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                required
                disabled={isSubmitting}
            >
                <option value="">Select user</option>
                {safeUsers.map((user) => (
                    <option key={user.email} value={user.email}>
                        {user.name} ({user.email})
                    </option>
                ))}
            </select>
            <br /><br />

            {error && <p style={{ color: 'red' }}><strong>{error}</strong></p>}

            <button type="submit" disabled={isSubmitting || safeUsers.length === 0}>
                {isSubmitting ? 'Adding…' : 'Add Expense'}
            </button>
        </form>
    );
}

export default ExpenseForm;
