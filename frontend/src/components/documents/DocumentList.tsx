import React from 'react';
import { DocumentTextIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Document {
  id: string;
  title: string;
  type: 'CONTRACT' | 'COMPLIANCE' | 'IP_FILING' | 'OTHER';
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentClick }) => {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {documents.map((document) => (
          <li key={document.id}>
            <button
              onClick={() => onDocumentClick(document)}
              className="block w-full hover:bg-gray-50"
            >
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(document.status)}
                  </div>
                  <div className="min-w-0 flex-1 px-4">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">
                        {document.title}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {document.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>
                          Created on{' '}
                          {new Date(document.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
