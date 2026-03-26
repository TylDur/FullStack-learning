import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { formatIndianRupee } from '../../utils/analytics';

const BudgetAlerts = () => {
  const { alerts, clearAlert, clearAllAlerts } = useExpenseContext();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Budget Alerts
        </p>
        <button
          onClick={clearAllAlerts}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>
      
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`rounded-xl p-4 flex items-center justify-between shadow-sm ${
            alert.type === 'warning'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {alert.type === 'warning' ? '⚠️' : '🔴'}
            </span>
            <div>
              <p className={`text-sm font-medium ${
                alert.type === 'warning' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {alert.category}
              </p>
              <p className={`text-xs ${
                alert.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {alert.message}
              </p>
              {alert.type === 'exceeded' && (
                <p className="text-xs text-red-500 mt-1">
                  Overspent by {formatIndianRupee(alert.overspent)}
                </p>
              )}
              {alert.type === 'warning' && (
                <p className="text-xs text-yellow-600 mt-1">
                  {formatIndianRupee(alert.remaining)} remaining
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => clearAlert(alert.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlerts;