import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { CorrelationResult } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CriticalAlertsProps {
  alerts: CorrelationResult[];
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ alerts }) => {
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'critical') return 'bg-red-600 text-white';
    if (severityLower === 'high') return 'bg-orange-600 text-white';
    if (severityLower === 'medium') return 'bg-yellow-600 text-white';
    return 'bg-blue-600 text-white';
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      elastic: 'bg-purple-600',
      tenable: 'bg-blue-600',
      defender: 'bg-green-600',
      opencti: 'bg-yellow-600',
    };
    return colors[source] || 'bg-gray-600';
  };

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-xl font-bold text-white">
            Alertas Críticos Correlacionados
          </h2>
          <span className="ml-auto bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {alerts.length} Ativos em Risco
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Nenhum alerta crítico encontrado no período selecionado
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {alerts.map((correlation) => (
              <div key={correlation.asset} className="p-4 hover:bg-gray-750 transition">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedAsset(
                      expandedAsset === correlation.asset ? null : correlation.asset
                    )
                  }
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`text-2xl font-bold ${getRiskColor(correlation.risk_score)}`}>
                      {correlation.risk_score}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {correlation.asset}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-gray-400 text-sm">
                          {correlation.alerts.length} alertas
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-sm">
                          {correlation.vulnerability_count} vulnerabilidades
                        </span>
                        {correlation.mitre_techniques.length > 0 && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400 text-sm">
                              {correlation.mitre_techniques.length} técnicas MITRE
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {expandedAsset === correlation.asset ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedAsset === correlation.asset && (
                  <div className="mt-4 space-y-2">
                    {correlation.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${getSourceColor(
                                  alert.source
                                )}`}
                              >
                                {alert.source.toUpperCase()}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                                  alert.severity
                                )}`}
                              >
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {format(new Date(alert.timestamp), 'dd/MM/yyyy HH:mm', {
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                            <h4 className="text-white font-medium mb-1">{alert.title}</h4>
                            {alert.description && (
                              <p className="text-gray-400 text-sm">{alert.description}</p>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <div className={`text-lg font-bold ${getRiskColor(alert.score)}`}>
                              {alert.score.toFixed(1)}
                            </div>
                            <div className="text-gray-500 text-xs">Score</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {correlation.mitre_techniques.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                        <h5 className="text-white font-semibold mb-2 text-sm">
                          Técnicas MITRE ATT&CK:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {correlation.mitre_techniques.map((technique) => (
                            <span
                              key={technique}
                              className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs"
                            >
                              {technique}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalAlerts;
