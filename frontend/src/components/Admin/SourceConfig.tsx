import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { Database, Plus, Trash2, Power, PowerOff } from 'lucide-react';
import type { DataSource } from '@/types';

const SourceConfig: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    source_type: 'elastic',
    is_enabled: true,
    config: {},
  });

  const { data: sources, isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: adminAPI.listDataSources,
  });

  const createMutation = useMutation({
    mutationFn: adminAPI.createDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      setShowCreateForm(false);
      setNewSource({
        name: '',
        source_type: 'elastic',
        is_enabled: true,
        config: {},
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminAPI.deleteDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newSource);
  };

  const getSourceIcon = (type: string) => {
    const icons: Record<string, string> = {
      elastic: '🔍',
      tenable: '🛡️',
      defender: '🔐',
      opencti: '🎯',
    };
    return icons[type] || '📊';
  };

  const getSourceColor = (type: string) => {
    const colors: Record<string, string> = {
      elastic: 'bg-purple-600',
      tenable: 'bg-blue-600',
      defender: 'bg-green-600',
      opencti: 'bg-yellow-600',
    };
    return colors[type] || 'bg-gray-600';
  };

  if (isLoading) {
    return <div className="text-white text-center py-8">Carregando fontes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Fontes de Dados</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Fonte
        </button>
      </div>

      {/* Create Source Form */}
      {showCreateForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Nova Fonte de Dados</h3>
          <form onSubmit={handleCreateSource} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Fonte
                </label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Ex: Elasticsearch Produção"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={newSource.source_type}
                  onChange={(e) =>
                    setNewSource({ ...newSource, source_type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="elastic">Elasticsearch SIEM</option>
                  <option value="tenable">Tenable Vulnerability Management</option>
                  <option value="defender">Microsoft Defender</option>
                  <option value="opencti">OpenCTI</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Configuração JSON
              </label>
              <textarea
                value={JSON.stringify(newSource.config, null, 2)}
                onChange={(e) => {
                  try {
                    setNewSource({ ...newSource, config: JSON.parse(e.target.value) });
                  } catch {}
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder='{"url": "https://...", "api_key": "..."}'
              />
              <p className="text-gray-400 text-xs mt-1">
                Exemplo: {`{"url": "https://elastic.example.com", "username": "admin", "password": "***"}`}
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newSource.is_enabled}
                onChange={(e) =>
                  setNewSource({ ...newSource, is_enabled: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-300">Habilitar fonte</label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Criando...' : 'Criar Fonte'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources?.map((source: DataSource) => (
          <div
            key={source.id}
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`text-3xl ${getSourceColor(source.source_type)} p-3 rounded-lg`}>
                  {getSourceIcon(source.source_type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{source.source_type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {source.is_enabled ? (
                  <Power className="w-5 h-5 text-green-500" />
                ) : (
                  <PowerOff className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`font-semibold ${
                    source.is_enabled ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {source.is_enabled ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              {source.last_sync && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Última sincronização:</span>
                  <span className="text-gray-300">
                    {new Date(source.last_sync).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Criado em:</span>
                <span className="text-gray-300">
                  {new Date(source.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Tem certeza que deseja deletar a fonte ${source.name}?`
                    )
                  ) {
                    deleteMutation.mutate(source.id);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sources?.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhuma fonte configurada
          </h3>
          <p className="text-gray-400 mb-6">
            Adicione fontes de dados para começar a coletar informações de segurança
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Adicionar Primeira Fonte
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceConfig;
