/**
 * Udhaari Net Expense Engine
 * 
 * Logic:
 * Gross Spend = Total Personal Expenses + Total Group Expenses (Paid by Me)
 * Net Spend = Gross Spend - (Total I am Owed) + (Total I Owe Others)
 * 
 * Alternatively:
 * Net Spend = Personal Expenses + Sum(My actual share in every group transaction)
 */

export const calculateNetSpend = (personalExpenses, groupExpenses, userId) => {
  const totalPersonal = personalExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  
  let totalOwedToMe = 0;
  let totalIOweOthers = 0;
  let totalMyGroupShare = 0;

  groupExpenses.forEach(expense => {
    const isPaidByMe = expense.paidBy === userId;
    const mySplit = expense.splits.find(s => s.userId === userId);
    const myShare = mySplit ? mySplit.amount : 0;

    totalMyGroupShare += myShare;

    if (isPaidByMe) {
      // I paid the whole amount, so I'm owed the portions others are supposed to pay
      const othersShare = expense.amount - myShare;
      totalOwedToMe += othersShare;
    } else if (mySplit) {
      // Someone else paid, I owe my share
      totalIOweOthers += myShare;
    }
  });

  return {
    personal: totalPersonal,
    groupShare: totalMyGroupShare,
    owedToMe: totalOwedToMe,
    iOweOthers: totalIOweOthers,
    netSpend: totalPersonal + totalMyGroupShare,
    grossPaid: totalPersonal + groupExpenses.filter(e => e.paidBy === userId).reduce((acc, e) => acc + e.amount, 0)
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
