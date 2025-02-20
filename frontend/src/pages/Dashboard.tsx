import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import CustomToast from '../components/CustomToast';

interface DashboardStats {
  totalDocuments: number;
  pendingReviews: number;
  upcomingDeadlines: number;
  complianceIssues: number;
}

interface RecentActivity {
  id: string;
  type: 'DOCUMENT' | 'COMPLIANCE' | 'ALERT';
  action: string;
  title: string;
  timestamp: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingReviews: 0,
    upcomingDeadlines: 0,
    complianceIssues: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity'),
      ]);

      setStats(statsResponse.data);
      setRecentActivity(activityResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalDocuments: 0,
        pendingReviews: 0,
        upcomingDeadlines: 0,
        complianceIssues: 0,
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'passed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400';
      case 'pending':
      case 'in progress':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'failed':
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Overview of your legal management system
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => navigate('/documents')}
          className="cursor-pointer relative overflow-hidden rounded-lg bg-white dark:bg-dark-card px-4 py-5 shadow sm:px-6 hover:shadow-lg transition-shadow"
        >
          <dt>
            <div className="absolute rounded-md bg-primary-500 p-3">
              <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalDocuments}</p>
          </dd>
        </div>

        <div
          onClick={() => navigate('/documents')}
          className="cursor-pointer relative overflow-hidden rounded-lg bg-white dark:bg-dark-card px-4 py-5 shadow sm:px-6 hover:shadow-lg transition-shadow"
        >
          <dt>
            <div className="absolute rounded-md bg-yellow-500 p-3">
              <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">Pending Reviews</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingReviews}</p>
          </dd>
        </div>

        <div
          onClick={() => navigate('/compliance')}
          className="cursor-pointer relative overflow-hidden rounded-lg bg-white dark:bg-dark-card px-4 py-5 shadow sm:px-6 hover:shadow-lg transition-shadow"
        >
          <dt>
            <div className="absolute rounded-md bg-red-500 p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Issues</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.complianceIssues}</p>
          </dd>
        </div>

        <div
          onClick={() => navigate('/compliance')}
          className="cursor-pointer relative overflow-hidden rounded-lg bg-white dark:bg-dark-card px-4 py-5 shadow sm:px-6 hover:shadow-lg transition-shadow"
        >
          <dt>
            <div className="absolute rounded-md bg-green-500 p-3">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Deadlines</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.upcomingDeadlines}</p>
          </dd>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-dark-card shadow">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'DOCUMENT' && (
                      <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    )}
                    {activity.type === 'COMPLIANCE' && (
                      <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-400" />
                    )}
                    {activity.type === 'ALERT' && (
                      <BellIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
