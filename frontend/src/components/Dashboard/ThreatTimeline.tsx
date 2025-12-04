import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineEvent {
  timestamp: string;
  source: string;
  severity: string;
  title: string;
  asset: string;
}

interface ThreatTimelineProps {
  timeline: TimelineEvent[];
}

const ThreatTimeline: React.FC<ThreatTimelineProps> = ({ timeline }) => {
  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      elastic: 'bg-purple-600',
      tenable: 'bg-blue-600',
      defender: 'bg-green-600',
      opencti: 'bg-yellow-600',
    };
    return colors[source] || 'bg-gray-600';
  };

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'critical') return 'border-red-500';
    if (severityLower === 'high') return 'border-orange-500';
    return 'border-yellow-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-xl font-bold text-white">Timeline de Ameaças</h2>
        </div>
      </div>

      <div className="p-6">
        {timeline.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Nenhum evento encontrado
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {timeline.map((event, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 bg-gray-900 rounded-lg border-l-4 ${getSeverityColor(
                  event.severity
                )}`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gray-400 text-sm">
                    {format(new Date(event.timestamp), 'HH:mm', { locale: ptBR })}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {format(new Date(event.timestamp), 'dd/MM', { locale: ptBR })}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold text-white ${getSourceColor(
                        event.source
                      )}`}
                    >
                      {event.source.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-sm">{event.asset}</span>
                  </div>
                  <p className="text-white text-sm">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatTimeline;
