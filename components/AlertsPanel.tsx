import React from 'react';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Alert Center</h2>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <div key={alert.alert_id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-full ${
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                  alert.severity === 'High' ? 'bg-orange-100 text-orange-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <AlertTriangle size={24} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {alert.type} Alert: {alert.supplier_name}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    View Details
                  </button>
                  <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  alert.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
