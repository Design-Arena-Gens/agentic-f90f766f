'use client';

import { useState } from 'react';
import { FileText, Users, Shield, Activity, FolderOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import DocumentList from '@/components/DocumentList';
import DocumentForm from '@/components/DocumentForm';
import WorkflowView from '@/components/WorkflowView';
import AuditTrail from '@/components/AuditTrail';
import UserManagement from '@/components/UserManagement';
import DocumentTypeManagement from '@/components/DocumentTypeManagement';
import ComplianceReporting from '@/components/ComplianceReporting';
import { db } from '@/lib/db';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'documents' | 'workflows' | 'audit' | 'users' | 'types' | 'compliance'>('documents');
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const documents = db.getAllDocuments();
  const workflows = db.getAllWorkflows();
  const auditLogs = db.getAllAuditLogs();

  const stats = {
    totalDocuments: documents.length,
    activeWorkflows: workflows.filter(w => w.status === 'Active').length,
    pendingApprovals: documents.filter(d => d.status === 'In Review').length,
    complianceRate: 98.5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DocumentManagement</h1>
                <p className="text-sm text-gray-500">21 CFR Part 11 Compliant Pharmaceutical DMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                GMP Compliant
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
              </div>
              <FolderOpen className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeWorkflows}</p>
              </div>
              <Activity className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.complianceRate}%</p>
              </div>
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documents</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('workflows')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'workflows'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Workflows</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audit'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Audit Trail</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('types')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'types'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5" />
                  <span>Document Types</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'compliance'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Compliance</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'documents' && (
              <div>
                {showCreateDocument ? (
                  <DocumentForm
                    onClose={() => setShowCreateDocument(false)}
                    onSave={() => {
                      setShowCreateDocument(false);
                      window.location.reload();
                    }}
                  />
                ) : (
                  <DocumentList
                    onCreateNew={() => setShowCreateDocument(true)}
                    onSelectDocument={(id) => setSelectedDocumentId(id)}
                  />
                )}
              </div>
            )}
            {activeTab === 'workflows' && <WorkflowView />}
            {activeTab === 'audit' && <AuditTrail />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'types' && <DocumentTypeManagement />}
            {activeTab === 'compliance' && <ComplianceReporting />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="text-center text-sm text-gray-500">
          <p>DocumentManagement System - Compliant with 21 CFR Part 11, ISO 9001, ICH Q7, and GMP Standards</p>
          <p className="mt-2">© 2024 Pharmaceutical DMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
