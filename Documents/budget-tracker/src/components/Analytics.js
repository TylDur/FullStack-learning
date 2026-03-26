import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseContext } from '../context/ExpenseContext';
import Navbar from './Navbar';
import SpendingPieChart from './charts/SpendingPieChart';
import MonthlyBarChart from './charts/MonthlyBarChart';
import CategoryBreakdown from './charts/CategoryBreakdown';
import AnalyticsCards from './analytics/AnalyticsCards';
import FinancialHealthCard from './analytics/FinancialHealthCard';
import WeekdaySpendingChart from './analytics/WeekdaySpendingChart';
import SmartInsights from './analytics/SmartInsights';
import DailySpendingHeatmap from './analytics/DailySpendingHeatmap';

const Analytics = () => {
  const { loading } = useExpenseContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Advanced Analytics 📊
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Deep insights into your spending patterns
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Top Row - Health Score & Smart Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FinancialHealthCard />
          <SmartInsights />
        </div>

        {/* Summary Cards */}
        <AnalyticsCards />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Spending Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">
                Spending Breakdown
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                By category this month
              </p>
            </div>
            <SpendingPieChart />
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">
                Monthly Trend
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 6 months spending
              </p>
            </div>
            <MonthlyBarChart />
          </div>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekday Spending Pattern */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">
                Weekday Spending Pattern
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                When do you spend the most?
              </p>
            </div>
            <WeekdaySpendingChart />
          </div>

          {/* Daily Spending Heatmap */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">
                Daily Spending Heatmap
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Hover over any day to see details
              </p>
            </div>
            <DailySpendingHeatmap />
          </div>
        </div>

        {/* Full Width - Budget vs Spent */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">
                Budget vs Spent
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Category wise comparison
              </p>
            </div>
            <CategoryBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;