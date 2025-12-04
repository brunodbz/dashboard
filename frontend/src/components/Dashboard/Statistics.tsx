import type { FC } from 'react';
import { AlertTriangle, Bug, Target, Activity } from 'lucide-react';
import type { DashboardStats } from '@/types';

interface StatisticsProps {
  stats: DashboardStats;
}

const Statistics: FC<StatisticsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Alertas Críticos',
      value: stats.total_critical_alerts,
      icon: AlertTriangle,
      color: 'bg-red-600',
      subtext: `${stats.critical_count} críticos, ${stats.high_count} altos`,
    },
    {
      title: 'Vulnerabilidades',
      value: stats.total_vulnerabilities,
      icon: Bug,
      color: 'bg-orange-600',
      subtext: `${stats.exploitable_vulns} com exploit disponível`,
    },
    {
      title: 'Indicadores de Ameaça',
      value: stats.total_threat_indicators,
      icon: Target,
      color: 'bg-yellow-600',
      subtext: 'OpenCTI intelligence',
    },
    {
      title: 'Status das Fontes',
      value: Object.values(stats.sources_status).filter(s => s === 'active').length,
      icon: Activity,
      color: 'bg-green-600',
      subtext: `${Object.keys(stats.sources_status).length} fontes totais`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">{card.title}</h3>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{card.value}</div>
          <div className="text-gray-400 text-xs">{card.subtext}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
