'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, Download, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export default function ComplianceReporting() {
  const [reportType, setReportType] = useState<string>('21 CFR Part 11');

  const documents = db.getAllDocuments();
  const auditLogs = db.getAllAuditLogs();
  const workflows = db.getAllWorkflows();

  // Calculate compliance metrics
  const totalDocuments = documents.length;
  const approvedDocuments = documents.filter(d => d.status === 'Approved').length;
  const pendingReview = documents.filter(d => d.status === 'In Review').length;
  const draftDocuments = documents.filter(d => d.status === 'Draft').length;
  const complianceRate = totalDocuments > 0 ? ((approvedDocuments / totalDocuments) * 100).toFixed(1) : 0;

  // Mock compliance findings
  const findings = [
    {
      id: '1',
      severity: 'High' as const,
      category: 'Electronic Signatures',
      description: 'Some documents lack proper electronic signature validation',
      affectedDocuments: ['SOP-DC-001', 'QMS-001'],
      recommendation: 'Implement electronic signature verification for all critical documents',
      status: 'Open',
    },
    {
      id: '2',
      severity: 'Medium' as const,
      category: 'Audit Trail',
      description: 'Audit trail completeness needs review for recent document changes',
      affectedDocuments: ['VAL-MPV-003'],
      recommendation: 'Ensure all document modifications are properly logged',
      status: 'Open',
    },
    {
      id: '3',
      severity: 'Low' as const,
      category: 'Access Control',
      description: 'Review user permissions for document access levels',
      affectedDocuments: ['All Documents'],
      recommendation: 'Conduct quarterly access control audit',
      status: 'In Progress',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
      case 'High':
        return <XCircle className="h-5 w-5" />;
      case 'Medium':
        return <AlertCircle className="h-5 w-5" />;
      case 'Low':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Compliance Reporting</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor regulatory compliance and generate reports</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Compliance Score Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Compliance Score</h3>
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-bold">{complianceRate}%</span>
              <TrendingUp className="h-8 w-8 mb-2" />
            </div>
            <p className="text-sm mt-2 text-primary-100">Based on {totalDocuments} documents and {auditLogs.length} audit entries</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <Shield className="h-24 w-24" />
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">21 CFR Part 11</h4>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">98.5%</p>
          <p className="text-xs text-gray-500 mt-1">Electronic Records/Signatures</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">ISO 9001</h4>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">97.2%</p>
          <p className="text-xs text-gray-500 mt-1">Quality Management System</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">ICH Q7</h4>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">96.8%</p>
          <p className="text-xs text-gray-500 mt-1">API Good Manufacturing</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">GMP</h4>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">94.5%</p>
          <p className="text-xs text-gray-500 mt-1">Good Manufacturing Practice</p>
        </div>
      </div>

      {/* Document Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-3xl font-bold text-gray-900">{totalDocuments}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedDocuments}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingReview}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-3xl font-bold text-gray-600">{draftDocuments}</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Compliance Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="21 CFR Part 11">21 CFR Part 11</option>
              <option value="ISO 9001">ISO 9001</option>
              <option value="ICH Q7">ICH Q7</option>
              <option value="GMP">GMP</option>
              <option value="Audit Trail">Audit Trail</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Compliance Findings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Findings</h3>
        <div className="space-y-4">
          {findings.map((finding) => (
            <div
              key={finding.id}
              className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}
            >
              <div className="flex items-start space-x-4">
                {getSeverityIcon(finding.severity)}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{finding.category}</h4>
                      <p className="text-xs mt-1">{finding.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      finding.status === 'Open' ? 'bg-red-200 text-red-800' :
                      finding.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {finding.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold">Affected Documents:</span>{' '}
                      {finding.affectedDocuments.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold">Recommendation:</span>{' '}
                      {finding.recommendation}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <button className="px-3 py-1 bg-white text-gray-700 text-xs rounded hover:bg-gray-50">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-white text-gray-700 text-xs rounded hover:bg-gray-50">
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Audit Entries</p>
            <p className="text-3xl font-bold text-gray-900">{auditLogs.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Workflows</p>
            <p className="text-3xl font-bold text-gray-900">{workflows.filter(w => w.status === 'Active').length}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Electronic Signatures</p>
            <p className="text-3xl font-bold text-gray-900">
              {workflows.reduce((acc, w) => acc + w.steps.filter(s => s.signature).length, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
