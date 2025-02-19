import React, { useState, useEffect } from 'react';
import DocumentList from '../components/documents/DocumentList';
import UploadModal from '../components/documents/UploadModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  type: 'CONTRACT' | 'COMPLIANCE' | 'IP_FILING' | 'OTHER';
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    // You can implement document preview/details modal here
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Documents</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your legal documents, contracts, and filings
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Document
          </button>
        </div>
      </div>

      <div className="mt-8">
        <DocumentList documents={documents} onDocumentClick={handleDocumentClick} />
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={fetchDocuments}
      />
    </div>
  );
};

export default Documents;
