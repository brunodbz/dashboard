import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI, exportAPI } from '@/services/api';
import CriticalAlerts from './CriticalAlerts';
import Statistics from './Statistics';
import ThreatTimeline from './ThreatTimeline';
import { Shield, LogOut, Settings, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@/types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [timeRange, setTimeRange] = useState(24);
  const [isExporting, setIsExporting] = useState(false);

  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['critical-alerts', timeRange],
    queryFn: () => dashboardAPI.getCriticalAlerts(timeRange),
    refetchInterval: 60000, // Atualizar a cada 1 minuto
  });

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['statistics', timeRange],
    queryFn: () => dashboardAPI.getStatistics(timeRange),
    refetchInterval: 60000,
  });

  const { data: timeline, refetch: refetchTimeline } = useQuery({
    queryKey: ['timeline', timeRange],
    queryFn: () => dashboardAPI.getTimeline(timeRange),
    refetchInterval: 60000,
  });

  const handleRefresh = () => {
    refetchAlerts();
    refetchStats();
    refetchTimeline();
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      if (format === 'excel') {
        await exportAPI.exportExcel(timeRange);
      } else {
        await exportAPI.exportPDF(timeRange);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-white">SOC Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Última 1 hora</option>
                <option value={6}>Últimas 6 horas</option>
                <option value={24}>Últimas 24 horas</option>
                <option value={72}>Últimos 3 dias</option>
                <option value={168}>Última semana</option>
              </select>

              <button
                onClick={handleRefresh}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <div className="relative group">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                  disabled={isExporting}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exportar
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 hidden group-hover:block z-10">
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg"
                    disabled={isExporting}
                  >
                    Exportar Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-b-lg"
                    disabled={isExporting}
                  >
                    Exportar PDF
                  </button>
                </div>
              </div>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-gray-300">{user.username}</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">{user.role}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="text-white text-center py-8">Carregando estatísticas...</div>
        ) : (
          <Statistics stats={stats!} />
        )}

        {/* Critical Alerts */}
        <div className="mt-8">
          {alertsLoading ? (
            <div className="text-white text-center py-8">Carregando alertas...</div>
          ) : (
            <CriticalAlerts alerts={alerts || []} />
          )}
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <ThreatTimeline timeline={timeline || []} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
