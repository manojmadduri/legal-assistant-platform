import React from 'react';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Alert {
  id: string;
  type: 'DEADLINE' | 'COMPLIANCE' | 'DOCUMENT_EXPIRY' | 'CUSTOM';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';
}

interface AlertListProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onAlertClick }) => {
  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Alert['status']) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'RESOLVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'EXPIRED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <button
              onClick={() => onAlertClick(alert)}
              className="block w-full hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(alert.status)}
                    <p className="ml-2 truncate text-sm font-medium text-indigo-600">
                      {alert.title}
                    </p>
                  </div>
                  <div className="ml-2 flex flex-shrink-0">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                        alert.priority
                      )}`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <ClockIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <p>
                    Due by{' '}
                    {new Date(alert.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertList;
