export function getGroupSummary(group) {
  const userEmails = group.users.map((u) => u.email);
  const expenses = group.expenses || [];

  // Total spend
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Per-user contributions
  const contributions = {};
  userEmails.forEach((email) => (contributions[email] = 0));
  expenses.forEach((e) => {
    if (contributions[e.paid_by] !== undefined) {
      contributions[e.paid_by] += e.amount;
    }
  });

  // Equal share
  const sharePerUser = totalSpend / userEmails.length;

  // Owes or gets
    const balances = userEmails.map((email) => {
        const paid = contributions[email] || 0;
        const delta = paid - sharePerUser;

        return {
            email,
            name: group.users.find((u) => u.email === email)?.name || email,
            paid,
            owes: delta < 0 ? Math.abs(delta) : 0,
            getsBack: delta > 0 ? delta : 0,
        };
    });

    return {
    totalSpend,
    sharePerUser,
    balances,
  };
}
