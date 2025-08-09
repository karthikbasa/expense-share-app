import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Summary() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.summary) {
        return (
            <div className="grid-layout">
                <section className="card">
                    <h2>Summary</h2>
                    <p><em>No group data available. Please return and select a group.</em></p>
                    <button onClick={() => navigate('/')}>Go Home</button>
                </section>
            </div>
        );
    }

    const { groupName, status, summary, settlements, settledAt } = state;

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString();
    };

    return (
        <div className="grid-layout">
            <section className="card">
                <h2>Expense Summary for <em>{groupName}</em></h2>
                <p><strong>Status:</strong> {status}</p>

                {status === "settled" && (
                    <div style={{
                        marginBottom: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        color: "#444"
                    }}>
                        🎉 This group was settled on: <strong>{formatDate(settledAt)}</strong>
                    </div>
                )}

                <p><strong>Total Spend:</strong> ₹{summary.totalSpend}</p>
                <p><strong>Equal Share Per Person:</strong> ₹{summary.sharePerUser.toFixed(2)}</p>

                <h3>Individual Balances</h3>
                <ul>
                    {summary.balances.map((b, idx) => {
                        const balanceStatus =
                            b.owes > 0 ? `Owes ₹${b.owes.toFixed(2)}` :
                                b.getsBack > 0 ? `Gets back ₹${b.getsBack.toFixed(2)}` :
                                    'Settled';

                        return (
                            <li key={b.email || idx}>
                                {b.name} paid ₹{b.paid}. {balanceStatus}.
                            </li>
                        );
                    })}
                </ul>

                <h3>Who Owes Whom</h3>
                {settlements.length > 0 ? (
                    <ul>
                        {settlements.map((line, idx) => (
                            <li key={idx}>{line}</li>
                        ))}
                    </ul>
                ) : (
                    <p><em>All expenses are settled.</em></p>
                )}

                <button onClick={() => navigate(-1)}>Back to Group</button>
            </section>
        </div>
    );
}

export default Summary;
