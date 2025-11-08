'use client';

import { useState } from 'react';
import { FolderOpen, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { db } from '@/lib/db';

export default function DocumentTypeManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ type: '', description: '' });

  const documentTypes = db.getAllDocumentTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.createDocumentType(formData);
    setFormData({ type: '', description: '' });
    setShowCreateForm(false);
    window.location.reload();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Manual':
        return '📖';
      case 'Procedure':
        return '📋';
      case 'Process':
        return '🔄';
      case 'Work Instruction':
        return '📝';
      case 'Policy':
        return '📜';
      case 'Checklist':
        return '☑️';
      case 'Format':
        return '📄';
      case 'Template':
        return '📑';
      case 'Masters':
        return '🔐';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Type Management</h2>
          <p className="text-sm text-gray-600 mt-1">Configure and manage document types for your organization</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Document Type</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Document Type</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter document type name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter document type description"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Type
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Document Types</p>
          <p className="text-2xl font-bold text-gray-900">{documentTypes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900">{db.getAllDocuments().length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Most Used Type</p>
          <p className="text-lg font-bold text-gray-900">Procedure</p>
        </div>
      </div>

      {/* Document Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((docType) => {
          const docCount = db.getAllDocuments().filter(d => d.documentType === docType.type).length;

          return (
            <div
              key={docType.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getTypeIcon(docType.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{docType.type}</h3>
                    <p className="text-sm text-gray-500">{docCount} documents</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-800" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{docType.description}</p>
            </div>
          );
        })}
      </div>

      {/* Compliance Standards */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Classification Standards</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">21 CFR Part 11</h4>
              <p className="text-sm text-gray-600">Electronic records and electronic signatures compliance for all document types</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">ISO 9001</h4>
              <p className="text-sm text-gray-600">Quality management system documentation requirements</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">ICH Q7 / GMP</h4>
              <p className="text-sm text-gray-600">Good Manufacturing Practice documentation standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
