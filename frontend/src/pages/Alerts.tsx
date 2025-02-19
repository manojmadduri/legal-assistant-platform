import React, { useState, useEffect } from 'react';
import AlertList from '../components/alerts/AlertList';
import { BellIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Alert {
  id: string;
  type: 'DEADLINE' | 'COMPLIANCE' | 'DOCUMENT_EXPIRY' | 'CUSTOM';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Alert['status']>();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClick = async (alert: Alert) => {
    try {
      if (alert.status === 'PENDING') {
        await api.patch(`/alerts/${alert.id}`, { status: 'ACKNOWLEDGED' });
        toast.success('Alert acknowledged');
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert');
    }
  };

  const filteredAlerts = filter
    ? alerts.filter((alert) => alert.status === filter)
    : alerts;

  const alertStats = {
    total: alerts.length,
    pending: alerts.filter((a) => a.status === 'PENDING').length,
    urgent: alerts.filter((a) => a.priority === 'URGENT').length,
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Legal Alerts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage your legal deadlines, compliance updates, and document expirations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Alerts</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{alertStats.total}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Pending Alerts</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600">{alertStats.pending}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Urgent Alerts</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">{alertStats.urgent}</dd>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="mt-4 sm:mt-0">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter(undefined)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    !filter
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('PENDING')}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    filter === 'PENDING'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('ACKNOWLEDGED')}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    filter === 'ACKNOWLEDGED'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Acknowledged
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="mt-6">
        {filteredAlerts.length > 0 ? (
          <AlertList alerts={filteredAlerts} onAlertClick={handleAlertClick} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
            <BellIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter ? 'No alerts match the current filter' : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
