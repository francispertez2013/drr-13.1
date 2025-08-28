import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader, RefreshCw, Settings } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const DatabaseSelector: React.FC = () => {
  const { isConnected, connectionError, testConnection } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      {/* Database Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <Database size={16} />
        <span className="font-medium">Supabase</span>
        {isConnected ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <XCircle size={16} className="text-red-500" />
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="text-xs text-yellow-600 mt-1">
          {connectionError}
        </div>
      )}

      {/* Database Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Database Status</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Current Status */}
              <div className={`border rounded-lg p-4 ${
                isConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <span className={`font-medium ${isConnected ? 'text-green-800' : 'text-red-800'}`}>
                    {isConnected ? 'Connected to Supabase' : 'Connection Failed'}
                  </span>
                </div>
                {connectionError && (
                  <p className="text-sm text-red-700 mt-2">{connectionError}</p>
                )}
              </div>

              {/* Database Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Database Information</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Type:</strong> PostgreSQL (Supabase)</p>
                  <p><strong>Features:</strong> Real-time updates, Authentication, File storage</p>
                  <p><strong>Status:</strong> Production-ready</p>
                </div>
              </div>

              {/* Environment Variables Check */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Configuration Check</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL</span>
                    <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                      {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY</span>
                    <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                      {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Connection Button */}
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isTesting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2" size={16} />
                    Test Connection
                  </>
                )}
              </button>

              {!isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Setup Instructions</h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                    <li>Copy your project URL and anon key</li>
                    <li>Update your environment variables</li>
                    <li>Run the database migrations</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseSelector;