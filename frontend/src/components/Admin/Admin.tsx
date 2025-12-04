import type { FC } from 'react';
import { useState } from 'react';
import { Shield, Users, Database, ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import SourceConfig from './SourceConfig';
import type { User } from '@/types';

interface AdminProps {
  user: User;
  onLogout: () => void;
}

const Admin: FC<AdminProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'sources'>('users');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Shield className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-300">{user.username}</span>
              <span className="text-xs bg-red-600 px-2 py-1 rounded">{user.role}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-4 py-3 border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Gerenciamento de Usuários
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`flex items-center px-4 py-3 border-b-2 transition ${
                activeTab === 'sources'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-5 h-5 mr-2" />
              Fontes de Dados
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'sources' && <SourceConfig />}
      </main>
    </div>
  );
};

export default Admin;
