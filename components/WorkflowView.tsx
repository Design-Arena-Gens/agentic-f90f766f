'use client';

import { useState } from 'react';
import { Activity, CheckCircle, Clock, XCircle, User, FileText, Plus } from 'lucide-react';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export default function WorkflowView() {
  const workflows = db.getAllWorkflows();
  const documents = db.getAllDocuments();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const selectedWorkflow = selectedWorkflowId ? db.getWorkflowById(selectedWorkflowId) : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Workflow Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage document review and approval workflows</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Active Workflows</h3>

          {workflows.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No workflows found</p>
              <p className="text-sm text-gray-500 mt-1">Create a workflow to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map((workflow) => {
                const doc = documents.find(d => d.id === workflow.documentId);
                return (
                  <div
                    key={workflow.id}
                    onClick={() => setSelectedWorkflowId(workflow.id)}
                    className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedWorkflowId === workflow.id
                        ? 'border-primary-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{workflow.workflowName}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {doc?.documentTitle || 'Unknown Document'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Step {workflow.currentStep + 1} of {workflow.steps.length}</span>
                            <span>•</span>
                            <span>Initiated by {workflow.initiatedBy}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        workflow.status === 'Active' ? 'bg-green-100 text-green-800' :
                        workflow.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workflow Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Details</h3>

          {selectedWorkflow ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">{selectedWorkflow.workflowName}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Initiated:</span>
                    <p className="font-medium">{format(new Date(selectedWorkflow.initiatedAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium">{selectedWorkflow.status}</p>
                  </div>
                </div>
              </div>

              {/* Workflow Steps */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Workflow Steps</h5>
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`border rounded-lg p-4 ${getStepStatusColor(step.status)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium text-sm">{step.stepName}</span>
                        </div>
                        <span className="text-xs font-semibold">{step.status}</span>
                      </div>

                      <div className="ml-8 space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>Assigned to: {step.assignedRole}</span>
                        </div>
                        {step.assignedUser && (
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>User: {step.assignedUser}</span>
                          </div>
                        )}
                        {step.completedAt && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>Completed: {format(new Date(step.completedAt), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        )}
                        {step.comments && (
                          <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                            <p className="text-gray-700">{step.comments}</p>
                          </div>
                        )}
                      </div>

                      {step.status === 'In Progress' && (
                        <div className="mt-3 ml-8 flex items-center space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Electronic Signatures */}
              {selectedWorkflow.steps.some(s => s.signature) && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Electronic Signatures</h5>
                  <div className="space-y-2">
                    {selectedWorkflow.steps
                      .filter(s => s.signature)
                      .map((step) => (
                        <div key={step.id} className="bg-gray-50 rounded p-3 text-xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{step.signature?.userName}</p>
                              <p className="text-gray-500">{step.signature?.userRole}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{step.signature?.action}</p>
                              <p className="text-gray-500">
                                {step.signature?.timestamp && format(new Date(step.signature.timestamp), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                          {step.signature?.reasonForAction && (
                            <p className="mt-2 text-gray-700">Reason: {step.signature.reasonForAction}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a workflow to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
