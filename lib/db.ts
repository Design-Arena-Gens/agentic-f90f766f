import { Document, DocumentType, Workflow, AuditLog, User, ElectronicSignature } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory database simulation
export class DatabaseService {
  private static instance: DatabaseService;
  private documents: Map<string, Document> = new Map();
  private documentTypes: Map<string, DocumentType> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private auditLogs: AuditLog[] = [];
  private users: Map<string, User> = new Map();

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeData() {
    // Initialize Document Types
    const docTypes: DocumentType[] = [
      { id: '1', type: 'Manual', description: 'Comprehensive guides and manuals' },
      { id: '2', type: 'Procedure', description: 'Standard Operating Procedures (SOPs)' },
      { id: '3', type: 'Process', description: 'Process documentation' },
      { id: '4', type: 'Work Instruction', description: 'Detailed work instructions' },
      { id: '5', type: 'Policy', description: 'Company policies and guidelines' },
      { id: '6', type: 'Checklist', description: 'Quality checklists' },
      { id: '7', type: 'Format', description: 'Document formats and templates' },
      { id: '8', type: 'Template', description: 'Reusable document templates' },
      { id: '9', type: 'Masters', description: 'Master documents' },
    ];

    docTypes.forEach(dt => this.documentTypes.set(dt.id, dt));

    // Initialize Sample Users
    const sampleUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@pharma.com',
        fullName: 'System Administrator',
        role: 'Admin',
        department: 'IT',
        isActive: true,
        permissions: [
          { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'approve', 'sign'] },
          { resource: 'workflows', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        ],
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        username: 'jsmith',
        email: 'jsmith@pharma.com',
        fullName: 'John Smith',
        role: 'Manager',
        department: 'Quality Assurance',
        isActive: true,
        permissions: [
          { resource: 'documents', actions: ['create', 'read', 'update', 'approve', 'sign'] },
          { resource: 'workflows', actions: ['create', 'read', 'update'] },
        ],
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '3',
        username: 'mjohnson',
        email: 'mjohnson@pharma.com',
        fullName: 'Mary Johnson',
        role: 'Reviewer',
        department: 'Regulatory Affairs',
        isActive: true,
        permissions: [
          { resource: 'documents', actions: ['read', 'approve', 'sign'] },
        ],
        createdAt: new Date('2024-02-01'),
      },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Initialize Sample Documents
    const sampleDocs: Omit<Document, 'id'>[] = [
      {
        documentTitle: 'Quality Management System Manual',
        documentNumber: 'QMS-001',
        documentVersion: '1.0',
        dateCreated: new Date('2024-01-10'),
        createdBy: 'John Smith',
        dateOfIssue: new Date('2024-01-15'),
        issuedBy: 'John Smith',
        issuerRole: 'Manager',
        effectiveFromDate: new Date('2024-02-01'),
        dateOfNextIssue: new Date('2025-01-15'),
        documentType: 'Manual',
        documentCategory: 'Quality Management',
        documentSecurity: 'Internal',
        status: 'Approved',
      },
      {
        documentTitle: 'Standard Operating Procedure - Document Control',
        documentNumber: 'SOP-DC-001',
        documentVersion: '2.1',
        dateCreated: new Date('2024-02-05'),
        createdBy: 'Mary Johnson',
        dateOfIssue: new Date('2024-02-10'),
        issuedBy: 'Mary Johnson',
        issuerRole: 'Reviewer',
        effectiveFromDate: new Date('2024-02-15'),
        dateOfNextIssue: new Date('2025-02-10'),
        documentType: 'Procedure',
        documentCategory: 'Document Management',
        documentSecurity: 'Internal',
        status: 'Approved',
      },
      {
        documentTitle: 'Manufacturing Process Validation Protocol',
        documentNumber: 'VAL-MPV-003',
        documentVersion: '1.0',
        dateCreated: new Date('2024-03-01'),
        createdBy: 'John Smith',
        dateOfIssue: new Date('2024-03-05'),
        issuedBy: 'John Smith',
        issuerRole: 'Manager',
        effectiveFromDate: new Date('2024-03-10'),
        dateOfNextIssue: new Date('2025-03-05'),
        documentType: 'Process',
        documentCategory: 'Manufacturing',
        documentSecurity: 'Confidential',
        status: 'In Review',
      },
    ];

    sampleDocs.forEach(doc => {
      const id = uuidv4();
      this.documents.set(id, { ...doc, id });
    });
  }

  // Document Operations
  public getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  public getDocumentById(id: string): Document | undefined {
    return this.documents.get(id);
  }

  public createDocument(doc: Omit<Document, 'id'>): Document {
    const id = uuidv4();
    const newDoc: Document = { ...doc, id };
    this.documents.set(id, newDoc);

    this.logAudit({
      userId: '1',
      userName: doc.createdBy,
      userRole: 'Author',
      action: 'CREATE_DOCUMENT',
      entityType: 'Document',
      entityId: id,
      ipAddress: '127.0.0.1',
      sessionId: uuidv4(),
    });

    return newDoc;
  }

  public updateDocument(id: string, updates: Partial<Document>): Document | undefined {
    const doc = this.documents.get(id);
    if (!doc) return undefined;

    const oldDoc = { ...doc };
    const updatedDoc = { ...doc, ...updates };
    this.documents.set(id, updatedDoc);

    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(updates).forEach(key => {
      if (oldDoc[key as keyof Document] !== updates[key as keyof Document]) {
        changes[key] = {
          old: oldDoc[key as keyof Document],
          new: updates[key as keyof Document],
        };
      }
    });

    this.logAudit({
      userId: '1',
      userName: 'System',
      userRole: 'System',
      action: 'UPDATE_DOCUMENT',
      entityType: 'Document',
      entityId: id,
      changes,
      ipAddress: '127.0.0.1',
      sessionId: uuidv4(),
    });

    return updatedDoc;
  }

  public deleteDocument(id: string): boolean {
    const success = this.documents.delete(id);
    if (success) {
      this.logAudit({
        userId: '1',
        userName: 'System',
        userRole: 'System',
        action: 'DELETE_DOCUMENT',
        entityType: 'Document',
        entityId: id,
        ipAddress: '127.0.0.1',
        sessionId: uuidv4(),
      });
    }
    return success;
  }

  // Document Type Operations
  public getAllDocumentTypes(): DocumentType[] {
    return Array.from(this.documentTypes.values());
  }

  public getDocumentTypeById(id: string): DocumentType | undefined {
    return this.documentTypes.get(id);
  }

  public createDocumentType(docType: Omit<DocumentType, 'id'>): DocumentType {
    const id = uuidv4();
    const newDocType: DocumentType = { ...docType, id };
    this.documentTypes.set(id, newDocType);

    this.logAudit({
      userId: '1',
      userName: 'System',
      userRole: 'Admin',
      action: 'CREATE_DOCUMENT_TYPE',
      entityType: 'System',
      entityId: id,
      ipAddress: '127.0.0.1',
      sessionId: uuidv4(),
    });

    return newDocType;
  }

  public updateDocumentType(id: string, updates: Partial<DocumentType>): DocumentType | undefined {
    const docType = this.documentTypes.get(id);
    if (!docType) return undefined;

    const updatedDocType = { ...docType, ...updates };
    this.documentTypes.set(id, updatedDocType);

    return updatedDocType;
  }

  public deleteDocumentType(id: string): boolean {
    return this.documentTypes.delete(id);
  }

  // Workflow Operations
  public getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  public getWorkflowById(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  public getWorkflowsByDocumentId(documentId: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.documentId === documentId);
  }

  public createWorkflow(workflow: Omit<Workflow, 'id'>): Workflow {
    const id = uuidv4();
    const newWorkflow: Workflow = { ...workflow, id };
    this.workflows.set(id, newWorkflow);

    this.logAudit({
      userId: '1',
      userName: workflow.initiatedBy,
      userRole: 'System',
      action: 'CREATE_WORKFLOW',
      entityType: 'Workflow',
      entityId: id,
      ipAddress: '127.0.0.1',
      sessionId: uuidv4(),
    });

    return newWorkflow;
  }

  public updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | undefined {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;

    const updatedWorkflow = { ...workflow, ...updates };
    this.workflows.set(id, updatedWorkflow);

    this.logAudit({
      userId: '1',
      userName: 'System',
      userRole: 'System',
      action: 'UPDATE_WORKFLOW',
      entityType: 'Workflow',
      entityId: id,
      ipAddress: '127.0.0.1',
      sessionId: uuidv4(),
    });

    return updatedWorkflow;
  }

  // User Operations
  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Audit Log Operations
  public getAllAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public getAuditLogsByEntityId(entityId: string): AuditLog[] {
    return this.auditLogs.filter(log => log.entityId === entityId);
  }

  public getAuditLogsByUserId(userId: string): AuditLog[] {
    return this.auditLogs.filter(log => log.userId === userId);
  }

  private logAudit(logData: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const auditLog: AuditLog = {
      id: uuidv4(),
      timestamp: new Date(),
      ...logData,
    };
    this.auditLogs.push(auditLog);
  }
}

export const db = DatabaseService.getInstance();
