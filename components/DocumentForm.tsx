'use client';

import { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { db } from '@/lib/db';
import { Document } from '@/types';

interface DocumentFormProps {
  onClose: () => void;
  onSave: () => void;
  document?: Document;
}

export default function DocumentForm({ onClose, onSave, document }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    documentTitle: document?.documentTitle || '',
    documentNumber: document?.documentNumber || '',
    documentVersion: document?.documentVersion || '1.0',
    createdBy: document?.createdBy || 'Current User',
    issuedBy: document?.issuedBy || 'Current User',
    issuerRole: document?.issuerRole || 'Author',
    documentType: document?.documentType || 'Manual',
    documentCategory: document?.documentCategory || '',
    documentSecurity: document?.documentSecurity || 'Internal',
    effectiveFromDate: document?.effectiveFromDate ? new Date(document.effectiveFromDate).toISOString().split('T')[0] : '',
    dateOfNextIssue: document?.dateOfNextIssue ? new Date(document.dateOfNextIssue).toISOString().split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const newDoc: Omit<Document, 'id'> = {
      documentTitle: formData.documentTitle,
      documentNumber: formData.documentNumber,
      documentVersion: formData.documentVersion,
      dateCreated: now,
      createdBy: formData.createdBy,
      dateOfIssue: now,
      issuedBy: formData.issuedBy,
      issuerRole: formData.issuerRole,
      effectiveFromDate: new Date(formData.effectiveFromDate),
      dateOfNextIssue: new Date(formData.dateOfNextIssue),
      documentType: formData.documentType as any,
      documentCategory: formData.documentCategory,
      documentSecurity: formData.documentSecurity as any,
      status: 'Draft',
    };

    db.createDocument(newDoc);
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {document ? 'Edit Document' : 'Create New Document'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentTitle"
                  value={formData.documentTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., SOP-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Version <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentVersion"
                  value={formData.documentVersion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Manual">Manual</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Process">Process</option>
                  <option value="Work Instruction">Work Instruction</option>
                  <option value="Policy">Policy</option>
                  <option value="Checklist">Checklist</option>
                  <option value="Format">Format</option>
                  <option value="Template">Template</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentCategory"
                  value={formData.documentCategory}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Quality Assurance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Security <span className="text-red-500">*</span>
                </label>
                <select
                  name="documentSecurity"
                  value={formData.documentSecurity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Internal">Internal</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Public">Public</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personnel Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personnel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issued By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="issuedBy"
                  value={formData.issuedBy}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="issuerRole"
                  value={formData.issuerRole}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Date Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveFromDate"
                  value={formData.effectiveFromDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Next Issue <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfNextIssue"
                  value={formData.dateOfNextIssue}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>21 CFR Part 11 Compliance:</strong> This document creation will be logged in the audit trail with your user ID, timestamp, and digital signature.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
