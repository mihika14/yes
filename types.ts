export interface Supplier {
  supplier_id: string;
  name: string;
  region: string;
  contact_person: string;
  email: string;
  overall_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  last_summary_date: string;
  category: string;
  spend_ytd: number;
}

export interface PurchaseOrder {
  po_id: string;
  supplier_id: string;
  order_date: string;
  delivery_due_date: string;
  actual_delivery_date?: string;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_value_usd: number;
}

export interface Alert {
  alert_id: string;
  supplier_id: string;
  supplier_name: string;
  type: 'Quality' | 'Delivery' | 'Contract' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  timestamp: string;
  status: 'New' | 'Reviewed' | 'Resolved';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface KPIMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status: 'success' | 'warning' | 'danger';
}
