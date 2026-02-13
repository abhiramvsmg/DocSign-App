export interface User {
    id: number;
    email: string;
    full_name: string;
    created_at: string;
}

export type DocumentStatus = 'draft' | 'pending' | 'completed' | 'declined';

export interface SignatureField {
    id: number;
    document_id: number;
    page_number: number;
    x_position: number;
    y_position: number;
    width: number;
    height: number;
    signer_email?: string;
    status: string;
    signature_data?: string;
}

export interface AuditLog {
    id: number;
    document_id: number;
    action: string;
    details?: string;
    created_at: string;
    user_id: number;
}

export interface Document {
    id: number;
    title: string;
    file_path: string;
    user_id: number;
    created_at: string;
    status: DocumentStatus;
    signed_file_path?: string;
    signing_token?: string;
    signature_fields: SignatureField[];
    audit_logs: AuditLog[];
}

