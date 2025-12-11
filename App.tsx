import React, { useState } from 'react';
import { Supplier, Alert } from './types';
import Dashboard from './components/Dashboard';
import SupplierDetail from './components/SupplierDetail';
import AlertsPanel from './components/AlertsPanel';
import { LayoutDashboard, Bell, Settings, User } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_SUPPLIERS: Supplier[] = [
  {
    supplier_id: 'S001',
    name: 'Alpha Components Ltd.',
    region: 'North America',
    contact_person: 'John Doe',
    email: 'j.doe@alpha.com',
    overall_score: 92,
    risk_level: 'Low',
    last_summary_date: '2023-10-15',
    category: 'Electronics',
    spend_ytd: 1250000
  },
  {
    supplier_id: 'S002',
    name: 'Beta Plastics Inc.',
    region: 'Asia Pacific',
    contact_person: 'Jane Smith',
    email: 'j.smith@beta.com',
    overall_score: 74,
    risk_level: 'High',
    last_summary_date: '2023-10-10',
    category: 'Raw Materials',
    spend_ytd: 850000
  },
  {
    supplier_id: 'S003',
    name: 'Gamma Logistics',
    region: 'Europe',
    contact_person: 'Hans Gruber',
    email: 'h.gruber@gamma.eu',
    overall_score: 88,
    risk_level: 'Medium',
    last_summary_date: '2023-09-28',
    category: 'Logistics',
    spend_ytd: 2100000
  },
  {
    supplier_id: 'S004',
    name: 'Delta Steel Corp',
    region: 'North America',
    contact_person: 'Sarah Connor',
    email: 's.connor@delta.com',
    overall_score: 65,
    risk_level: 'Critical',
    last_summary_date: '2023-10-01',
    category: 'Metals',
    spend_ytd: 3200000
  },
  {
    supplier_id: 'S005',
    name: 'Epsilon Tech',
    region: 'Asia Pacific',
    contact_person: 'Kenji Sato',
    email: 'k.sato@epsilon.jp',
    overall_score: 95,
    risk_level: 'Low',
    last_summary_date: '2023-10-20',
    category: 'Electronics',
    spend_ytd: 500000
  }
];

const MOCK_ALERTS: Alert[] = [
  {
    alert_id: 'A001',
    supplier_id: 'S002',
    supplier_name: 'Beta Plastics Inc.',
    type: 'Delivery',
    severity: 'Critical',
    message: '30% increase in lead time delays for component X over the past week. Potential impact on production line Y.',
    timestamp: '2 hours ago',
    status: 'New'
  },
  {
    alert_id: 'A002',
    supplier_id: 'S004',
    supplier_name: 'Delta Steel Corp',
    type: 'Quality',
    severity: 'High',
    message: 'Consistent quality issues detected in Batch #492. Defect rate spiked to 5.2%.',
    timestamp: '1 day ago',
    status: 'New'
  },
  {
    alert_id: 'A003',
    supplier_id: 'S003',
    supplier_name: 'Gamma Logistics',
    type: 'Contract',
    severity: 'Medium',
    message: 'Contract renewal due in 30 days. SLA adherence dropped by 2% last quarter.',
    timestamp: '3 days ago',
    status: 'Reviewed'
  }
];

type View = 'dashboard' | 'detail' | 'alerts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [alerts] = useState<Alert[]>(MOCK_ALERTS);

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setCurrentView('detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            suppliers={suppliers} 
            alerts={alerts} 
            onSelectSupplier={handleSelectSupplier} 
          />
        );
      case 'detail':
        return selectedSupplier ? (
          <SupplierDetail 
            supplier={selectedSupplier} 
            alerts={alerts.filter(a => a.supplier_id === selectedSupplier.supplier_id)}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : (
          <div>Error: No supplier selected</div>
        );
      case 'alerts':
        return <AlertsPanel alerts={alerts} />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">VendorVerse</h1>
          <p className="text-xs text-slate-500 mt-1">AI-Powered Nexus</p>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'dashboard' || currentView === 'detail' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'alerts' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-800'
            }`}
          >
            <Bell size={20} />
            <span className="font-medium">Alerts</span>
            {alerts.filter(a => a.status === 'New').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {alerts.filter(a => a.status === 'New').length}
              </span>
            )}
          </button>
          
          <div className="pt-8 pb-2 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Settings
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400">
            <User size={20} />
            <span className="font-medium">Profile</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400">
            <Settings size={20} />
            <span className="font-medium">Configuration</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm font-medium text-white mt-1">Alex Morgan</p>
            <p className="text-xs text-slate-500">Procurement Manager</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h1 className="font-bold text-slate-900">VendorVerse</h1>
          <button className="p-2 text-slate-600">
            <LayoutDashboard size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
