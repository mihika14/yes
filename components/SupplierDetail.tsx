import React, { useState, useEffect } from 'react';
import { Supplier, Alert } from '../types';
import { generateSupplierSummary } from '../services/geminiService';
import { 
  ArrowLeft, 
  Bot, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  FileText,
  Truck,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface SupplierDetailProps {
  supplier: Supplier;
  alerts: Alert[];
  onBack: () => void;
}

const mockPerformanceData = [
  { month: 'Jan', otd: 92, quality: 98 },
  { month: 'Feb', otd: 94, quality: 97 },
  { month: 'Mar', otd: 88, quality: 99 },
  { month: 'Apr', otd: 95, quality: 96 },
  { month: 'May', otd: 91, quality: 95 },
  { month: 'Jun', otd: 96, quality: 98 },
];

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, alerts, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    // Reset state when supplier changes
    setAiSummary(null);
  }, [supplier]);

  const handleGenerateReport = async () => {
    setLoadingSummary(true);
    const summary = await generateSupplierSummary(supplier, alerts);
    setAiSummary(summary);
    setLoadingSummary(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{supplier.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Truck size={14} /> {supplier.region}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Mail size={14} /> {supplier.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Mail size={16} /> Contact
          </button>
          <button 
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200"
            disabled={loadingSummary}
          >
            <Bot size={18} />
            {loadingSummary ? 'Generating...' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      {/* AI Summary Section */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bot size={100} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <h3 className="text-blue-900 font-bold flex items-center gap-2 mb-2">
              <Bot size={20} /> AI Performance Executive Summary
            </h3>
            <p className="text-blue-800 leading-relaxed text-sm md:text-base">
              {aiSummary}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Overall Score</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              supplier.overall_score > 80 ? 'text-green-600' : 'text-amber-600'
            }`}>
              {supplier.overall_score}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">On-Time Delivery</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">94.5%</span>
            <span className="text-xs text-green-600 font-medium flex items-center">
              <ArrowLeft size={10} className="rotate-90" /> 2.1%
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Defect Rate</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">1.2%</span>
            <span className="text-xs text-red-600 font-medium flex items-center">
              <ArrowLeft size={10} className="-rotate-90" /> 0.3%
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Open Alerts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {alerts.filter(a => a.status === 'New').length}
            </span>
            <span className="text-xs text-slate-400">active</span>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 px-6 flex gap-8">
          {['overview', 'quality', 'delivery', 'contracts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Performance Trends (6 Months)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="otd" name="On-Time Delivery %" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="quality" name="Quality Score %" stroke="#6366F1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">PO #49283-{i} Created</p>
                        <p className="text-xs text-slate-500 mt-0.5">Automated order generation based on inventory levels.</p>
                        <p className="text-xs text-slate-400 mt-2">2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'quality' && (
             <div className="text-center py-12 text-slate-500">
               <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
               <p>Detailed quality reports and inspection logs would appear here.</p>
             </div>
          )}

          {activeTab === 'delivery' && (
             <div className="text-center py-12 text-slate-500">
               <Truck size={48} className="mx-auto text-slate-300 mb-4" />
               <p>Logistics tracking, shipping manifests, and delay analysis would appear here.</p>
             </div>
          )}

           {activeTab === 'contracts' && (
             <div className="text-center py-12 text-slate-500">
               <FileText size={48} className="mx-auto text-slate-300 mb-4" />
               <p>Active contracts, SLA terms, and compliance audit trails would appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
