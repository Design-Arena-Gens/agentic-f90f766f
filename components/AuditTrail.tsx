'use client';

import { useState } from 'react';
import { Shield, Search, Download, Filter } from 'lucide-react';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterEntityType, setFilterEntityType] = useState('all');

  const auditLogs = db.getAllAuditLogs();

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action.includes(filterAction);
    const matchesEntityType = filterEntityType === 'all' || log.entityType === filterEntityType;

    return matchesSearch && matchesAction && matchesEntityType;
  });

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'text-green-600';
    if (action.includes('UPDATE')) return 'text-blue-600';
    if (action.includes('DELETE')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'Document':
        return '📄';
      case 'Workflow':
        return '🔄';
      case 'User':
        return '👤';
      case 'System':
        return '⚙️';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Audit Trail</h2>
          <p className="text-sm text-gray-600 mt-1">
            21 CFR Part 11 compliant audit log - All system activities are tracked and immutable
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Compliance Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">21 CFR Part 11 Compliance</p>
            <p>
              This audit trail records all user activities with timestamps, user identification, and cannot be modified or deleted.
              It includes computer-generated, time-stamped audit trails to independently record the date and time of operator entries and actions.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="APPROVE">Approve</option>
          <option value="REJECT">Reject</option>
        </select>
        <select
          value={filterEntityType}
          onChange={(e) => setFilterEntityType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Entity Types</option>
          <option value="Document">Document</option>
          <option value="Workflow">Workflow</option>
          <option value="User">User</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredLogs.length} of {auditLogs.length} audit entries
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.slice(0, 50).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-xs text-gray-500">{log.userRole}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEntityIcon(log.entityType)}</span>
                      <div>
                        <div className="text-sm text-gray-900">{log.entityType}</div>
                        <div className="text-xs text-gray-500 font-mono">{log.entityId.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.changes ? (
                      <details className="cursor-pointer">
                        <summary className="text-primary-600 hover:text-primary-800">
                          View Changes
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          {Object.entries(log.changes).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <strong>{key}:</strong>
                              <div className="ml-2">
                                <div className="text-red-600">- {JSON.stringify(value.old)}</div>
                                <div className="text-green-600">+ {JSON.stringify(value.new)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <span className="text-gray-400">No changes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No audit logs found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Audit Log Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Documents</p>
          <p className="text-2xl font-bold text-gray-900">
            {auditLogs.filter(l => l.entityType === 'Document').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Workflows</p>
          <p className="text-2xl font-bold text-gray-900">
            {auditLogs.filter(l => l.entityType === 'Workflow').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">System Events</p>
          <p className="text-2xl font-bold text-gray-900">
            {auditLogs.filter(l => l.entityType === 'System').length}
          </p>
        </div>
      </div>
    </div>
  );
}
