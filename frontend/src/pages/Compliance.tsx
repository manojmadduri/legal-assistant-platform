import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ComplianceCheck {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  dueDate: string;
  createdAt: string;
}

const Compliance = () => {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCheck, setNewCheck] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/compliance');
      setChecks(response.data);
    } catch (error) {
      console.error('Error fetching compliance checks:', error);
      setChecks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newCheck.title.trim()) {
      toast.error('Please enter a title for the compliance check');
      return;
    }

    if (!newCheck.description.trim()) {
      toast.error('Please enter a description for the compliance check');
      return;
    }

    if (!newCheck.dueDate) {
      toast.error('Please select a due date');
      return;
    }

    // Validate due date is not in the past
    const selectedDate = new Date(newCheck.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Due date cannot be in the past');
      return;
    }

    try {
      const response = await api.post('/compliance', {
        ...newCheck,
        title: newCheck.title.trim(),
        description: newCheck.description.trim()
      });
      
      if (response.data) {
        toast.success('Compliance check created successfully');
        setIsModalOpen(false);
        fetchChecks();
        setNewCheck({ title: '', description: '', dueDate: '' });
      }
    } catch (error: any) {
      console.error('Error creating compliance check:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create compliance check. Please try again.';
      toast.error(errorMessage);
    }
  };

  const updateStatus = async (id: string, status: 'PASSED' | 'FAILED') => {
    try {
      const response = await api.patch(`/compliance/${id}`, { status });
      
      if (response.data) {
        toast.success(`Status updated to ${status.toLowerCase()}`);
        fetchChecks();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update status. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Compliance Checks
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Monitor and manage compliance requirements and deadlines
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Check
          </button>
        </div>
      </div>

      {checks.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">No compliance checks found</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create your first compliance check
          </button>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {checks.map((check) => (
                      <tr key={check.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {check.title}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {check.description}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {new Date(check.dueDate).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              check.status === 'PASSED'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : check.status === 'FAILED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {check.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateStatus(check.id, 'PASSED')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => updateStatus(check.id, 'FAILED')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
