export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  is_active: boolean;
  created_at: string;
}

export interface CriticalAlert {
  id: string;
  source: 'elastic' | 'tenable' | 'defender' | 'opencti';
  severity: string;
  title: string;
  description?: string;
  asset?: string;
  score: number;
  timestamp: string;
  correlation_count?: number;
  related_indicators?: string[];
}

export interface CorrelationResult {
  asset: string;
  risk_score: number;
  alerts: CriticalAlert[];
  vulnerability_count: number;
  threat_indicators: string[];
  mitre_techniques: string[];
}

export interface DashboardStats {
  total_critical_alerts: number;
  total_vulnerabilities: number;
  total_threat_indicators: number;
  critical_count: number;
  high_count: number;
  exploitable_vulns: number;
  sources_status: {
    elasticsearch: string;
    tenable: string;
    defender: string;
    opencti: string;
  };
}

export interface DataSource {
  id: number;
  name: string;
  source_type: string;
  is_enabled: boolean;
  last_sync?: string;
  created_at: string;
}
