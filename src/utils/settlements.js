function calculateSettlements(payments) {
  const names = Object.keys(payments);
  const totalSpend = names.reduce((sum, name) => sum + payments[name], 0);
  const share = parseFloat((totalSpend / names.length).toFixed(2));

  // Calculate balances
  const balances = {};
  names.forEach(name => {
    balances[name] = parseFloat((payments[name] - share).toFixed(2));
  });

  const creditors = {};
  const debtors = {};

  for (const name in balances) {
    const balance = balances[name];
    if (balance > 0) creditors[name] = balance;
    else if (balance < 0) debtors[name] = -balance;
  }

  const settlements = [];

  for (const debtor in debtors) {
    let owed = debtors[debtor];
    for (const creditor in creditors) {
      let receivable = creditors[creditor];
      if (owed === 0 || receivable === 0) continue;

      const amount = Math.min(owed, receivable);
      settlements.push(`${debtor} should pay ${creditor} ₹${amount.toFixed(2)}`);

      creditors[creditor] = parseFloat((receivable - amount).toFixed(2));
      owed = parseFloat((owed - amount).toFixed(2));
    }
  }

  return settlements;
}

export default calculateSettlements;
