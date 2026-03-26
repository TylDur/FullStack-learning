import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import useExpenses from "../../hooks/useExpenses";
import { useExpenseContext } from "../../context/ExpenseContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MonthlyBarChart = () => {
  const { expenses } = useExpenses();
  const { currentMonth } = useExpenseContext();

  const getLast6Months = () => {
    const months = [];
    const [year, month] = currentMonth.split("-").map(Number);

    for (let i = 5; i >= 0; i--) {
      let m = month - i;
      let y = year;

      if (m < 1) {
        m += 12;
        y -= 1;
      }

      months.push(`${y}-${String(m).padStart(2, "0")}`);
    }

    return months;
  };

  const getMonthlyTotals = (months) => {
    return months.map(month => {
      const monthExpenses = expenses.filter(
        expense => expense.month === month
      );
      return monthExpenses.reduce(
        (total, expense) => total + expense.amount, 0
      );
    });
  };

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "2-digit" });
  };

  const months = getLast6Months();
  const totals = getMonthlyTotals(months);
  const maxTotal = Math.max(...totals);

  const data = {
    labels: months.map(formatMonthLabel),
    datasets: [{
      data: totals,
      backgroundColor: months.map(month =>
        month === currentMonth ? "#6366f1" : "#e0e7ff"
      ),
      hoverBackgroundColor: months.map(month =>
        month === currentMonth ? "#4f46e5" : "#c7d2fe"
      ),
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ₹${context.parsed.y.toFixed(2)}`
        },
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: maxTotal === 0 ? 100 : Math.ceil(maxTotal * 1.2),
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        border: {
          display: false,
          dash: [4, 4]
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11
          },
          callback: (value) => `₹${value}`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Summary row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">This month</span>
          <span className="text-base font-bold text-gray-800">
            ₹{totals[5].toFixed(0)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">Last month</span>
          <span className="text-base font-bold text-gray-800">
            ₹{totals[4].toFixed(0)}
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <Bar data={data} options={options} />

    </div>
  );
};

export default MonthlyBarChart;