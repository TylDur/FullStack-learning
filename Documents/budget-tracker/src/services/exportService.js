// Export expenses as CSV
export const exportToCSV = (expenses, month) => {
  if (!expenses || expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Date',
    'Category',
    'Description',
    'Amount (₹)',
    'Month'
  ];

  // Convert expenses to rows
  const rows = expenses.map(expense => [
    expense.date,
    expense.category,
    expense.description || 'No description',
    expense.amount.toFixed(2),
    expense.month || month
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for proper UTF-8 encoding (handles Indian Rupee symbol)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${month}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format month for filename
export const formatMonthForFilename = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(/ /g, '_');
};