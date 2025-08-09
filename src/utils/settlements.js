function calculateSettlements(payments) {
    const names = Object.keys(payments);
    const totalSpend = names.reduce((sum, name) => sum + payments[name], 0);
    const share = totalSpend / names.length;

    // Calculate balances
    const balances = {};
    names.forEach(name => {
        balances[name] = payments[name] - share;
    });

    const creditors = {};
    const debtors = {};

    for (const name in balances) {
        const balance = balances[name];
        if (balance > 0.01) creditors[name] = balance;
        else if (balance < -0.01) debtors[name] = -balance;
    }

    const settlements = [];

    for (const debtor in debtors) {
        let owed = debtors[debtor];
        for (const creditor in creditors) {
            let receivable = creditors[creditor];
            if (owed === 0 || receivable === 0) continue;

            const amount = Math.min(owed, receivable);
            if (amount < 0.01) continue;

            settlements.push(`${debtor} should pay ${creditor} ₹${amount.toFixed(2)}`);

            creditors[creditor] -= amount;
            owed -= amount;
        }
    }

    return settlements;
}

export default calculateSettlements;
