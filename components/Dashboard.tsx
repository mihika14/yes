import React, { useState } from 'react';
import { Supplier, Alert } from '../types';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  MoreHorizontal,
  FileText,
  Bot
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { recommendBestSupplier } from '../services/geminiService';

interface DashboardProps {
  suppliers: Supplier[];
  alerts: Alert[];
  onSelectSupplier: (supplier: Supplier) => void;
}

const ITEMS_PER_PAGE = 5;

const COLORS = ['#10B981', '#FBBF24', '#EF4444', '#6366F1'];

const Dashboard: React.FC<DashboardProps> = ({ suppliers, alerts, onSelectSupplier }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const rec = await recommendBestSupplier(suppliers);
    setAiRecommendation(rec);
    setIsAnalyzing(false);
  };

  const riskDistribution = [
    { name: 'Low Risk', value: suppliers.filter(s => s.risk_level === 'Low').length },
    { name: 'Medium Risk', value: suppliers.filter(s => s.risk_level === 'Medium').length },
    { name: 'High Risk', value: suppliers.filter(s => s.risk_level === 'High').length },
    { name: 'Critical', value: suppliers.filter(s => s.risk_level === 'Critical').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Suppliers</p>
              <h3 className="text-2xl font-bold text-slate-900">{suppliers.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Critical Risks</p>
              <h3 className="text-2xl font-bold text-red-600">
                {suppliers.filter(s => s.risk_level === 'Critical').length}
              </h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Alerts</p>
              <h3 className="text-2xl font-bold text-amber-600">
                {alerts.filter(a => a.status === 'New').length}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Filter size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors" onClick={handleAiAnalysis}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">AI Analyst</p>
              <h3 className="text-sm font-bold text-indigo-600 mt-1">
                {isAnalyzing ? 'Analyzing...' : 'Identify Best Supplier'}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Bot size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      {aiRecommendation && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 mt-1">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">AI Analyst Recommendation</h3>
              <div className="prose text-indigo-800 text-sm max-w-none">
                {aiRecommendation.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Supplier Performance</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Spend YTD</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSuppliers.map((supplier) => (
                  <tr 
                    key={supplier.supplier_id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => onSelectSupplier(supplier)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        supplier.overall_score >= 90 ? 'bg-green-100 text-green-800' :
                        supplier.overall_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {supplier.overall_score} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          supplier.risk_level === 'Low' ? 'bg-green-500' :
                          supplier.risk_level === 'Medium' ? 'bg-yellow-500' :
                          supplier.risk_level === 'High' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></span>
                        {supplier.risk_level}
                      </div>
                    </td>
                    <td className="px-6 py-4">${supplier.spend_ytd.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="View Report"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.alert_id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`mt-0.5 ${
                    alert.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{alert.supplier_name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
