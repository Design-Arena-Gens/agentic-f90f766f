export interface DocumentType {
  id: string;
  type: string;
  description: string;
}

export interface Document {
  id: string;
  documentTitle: string;
  documentNumber: string;
  documentVersion: string;
  dateCreated: Date;
  createdBy: string;
  dateOfIssue: Date;
  issuedBy: string;
  issuerRole: string;
  effectiveFromDate: Date;
  dateOfNextIssue: Date;
  documentType: 'Manual' | 'Procedure' | 'Process' | 'Work Instruction' | 'Policy' | 'Checklist' | 'Format' | 'Template' | 'Masters';
  documentCategory: string;
  documentSecurity: 'Confidential' | 'Internal' | 'Restricted' | 'Public';
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Archived';
  workflowStatus?: string;
  content?: string;
  attachments?: string[];
}

export interface WorkflowStep {
  id: string;
  stepName: string;
  stepOrder: number;
  assignedRole: string;
  assignedUser?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  completedAt?: Date;
  completedBy?: string;
  comments?: string;
  signature?: ElectronicSignature;
}

export interface Workflow {
  id: string;
  documentId: string;
  workflowName: string;
  documentType: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  initiatedBy: string;
  initiatedAt: Date;
}

export interface ElectronicSignature {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  action: 'Approved' | 'Rejected' | 'Reviewed';
  comments?: string;
  ipAddress: string;
  digitalSignature: string;
  reasonForAction: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'Document' | 'Workflow' | 'User' | 'System';
  entityId: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Manager' | 'Reviewer' | 'Author' | 'Viewer';
  department: string;
  isActive: boolean;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'sign')[];
}

export interface ComplianceReport {
  id: string;
  reportType: '21 CFR Part 11' | 'ISO 9001' | 'ICH Q7' | 'GMP' | 'Audit Trail';
  generatedAt: Date;
  generatedBy: string;
  dateRange: { from: Date; to: Date };
  findings: ComplianceFinding[];
  summary: string;
  status: 'Compliant' | 'Non-Compliant' | 'Needs Review';
}

export interface ComplianceFinding {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  affectedDocuments: string[];
  recommendation: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}
