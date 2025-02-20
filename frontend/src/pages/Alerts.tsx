import React, { useState, useEffect } from 'react';
import AlertList from '../components/alerts/AlertList';
import { BellIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

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
      setLoading(true);
      const response = await api.get('/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClick = async (alert: Alert) => {
    try {
      if (alert.status === 'PENDING') {
        await api.patch(`/alerts/${alert.id}`, { status: 'ACKNOWLEDGED' });
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const filteredAlerts = filter
    ? alerts.filter((alert) => alert.status === filter)
    : alerts;

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Alerts</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Monitor important notifications and deadlines
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center mt-16">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No alerts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You're all caught up! No pending alerts at the moment.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter(undefined)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  !filter
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'PENDING'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('ACKNOWLEDGED')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'ACKNOWLEDGED'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Acknowledged
              </button>
            </div>
          </div>

          <div className="mt-8">
            <AlertList alerts={filteredAlerts} onAlertClick={handleAlertClick} />
          </div>
        </>
      )}
    </div>
  );
};

export default Alerts;
