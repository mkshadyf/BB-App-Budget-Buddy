import type { Transaction, Budget, Settings } from "@shared/schema";

interface ExportData {
  transactions: Transaction[];
  budgets: Budget[];
  settings: Settings;
}

export const exportToExcel = (data: ExportData): void => {
  // Create CSV content for transactions
  const transactionHeaders = ["Date", "Description", "Category", "Type", "Amount"];
  const transactionRows = data.transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.type,
    t.amount
  ]);

  // Create CSV content for budgets
  const budgetHeaders = ["Category", "Budget Amount", "Spent Amount", "Remaining", "Period"];
  const budgetRows = data.budgets.map(b => [
    b.category,
    b.amount,
    b.spent,
    (parseFloat(b.amount) - parseFloat(b.spent)).toFixed(2),
    b.period
  ]);

  // Create CSV content
  const transactionCsv = [
    transactionHeaders.join(","),
    ...transactionRows.map(row => row.join(","))
  ].join("\n");

  const budgetCsv = [
    budgetHeaders.join(","),
    ...budgetRows.map(row => row.join(","))
  ].join("\n");

  // Combine both sections
  const csvContent = [
    "TRANSACTIONS",
    transactionCsv,
    "",
    "BUDGETS", 
    budgetCsv,
    "",
    "SETTINGS",
    `Currency,${data.settings.currency}`,
    `Theme,${data.settings.theme}`,
    `Notifications,${data.settings.notifications}`
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `budget-buddy-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
