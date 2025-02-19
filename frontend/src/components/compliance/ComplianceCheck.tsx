import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ComplianceResult {
  id: string;
  type: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW';
  description: string;
  recommendations?: string;
}

interface ComplianceCheckProps {
  result: ComplianceResult;
}

const ComplianceCheck: React.FC<ComplianceCheckProps> = ({ result }) => {
  const getStatusColor = (status: ComplianceResult['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return 'text-green-500';
      case 'NON_COMPLIANT':
        return 'text-red-500';
      case 'NEEDS_REVIEW':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ComplianceResult['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'NON_COMPLIANT':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon(result.status)}
          <h3 className={`ml-2 text-lg font-medium ${getStatusColor(result.status)}`}>
            {result.type}
          </h3>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
          result.status === 'COMPLIANT'
            ? 'bg-green-100 text-green-800'
            : result.status === 'NON_COMPLIANT'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {result.status}
        </span>
      </div>
      <p className="mt-4 text-gray-600">{result.description}</p>
      {result.recommendations && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900">Recommendations:</h4>
          <p className="mt-1 text-sm text-gray-600">{result.recommendations}</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceCheck;
