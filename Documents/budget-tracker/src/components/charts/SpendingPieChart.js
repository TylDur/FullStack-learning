import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import useExpenses from "../../hooks/useExpenses";
import { useExpenseContext } from "../../context/ExpenseContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#6366f1", "#22c55e", "#f97316",
  "#ef4444", "#eab308", "#14b8a6",
  "#ec4899", "#8b5cf6"
];

const SpendingPieChart = () => {
  const { expenses } = useExpenses();
  const { currentMonth } = useExpenseContext();

  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getCategoryTotals = () => {
    const totals = {};
    expenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category] += expense.amount;
      } else {
        totals[expense.category] = expense.amount;
      }
    });
    return totals;
  };

  const categoryTotals = getCategoryTotals();
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: COLORS.slice(0, labels.length),
      borderColor: "#ffffff",
      borderWidth: 3,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ₹${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">📊</span>
        <p className="text-sm text-gray-400 font-medium">
          No data for {formatMonthDisplay(currentMonth)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Donut chart */}
      <div className="relative w-48 h-48 mx-auto">
        <Pie data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-base font-bold text-gray-800">
            ₹{total.toFixed(0)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800">
                ₹{values[index].toFixed(0)}
              </span>
              <span className="text-xs text-gray-400 w-10 text-right">
                {((values[index] / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SpendingPieChart;