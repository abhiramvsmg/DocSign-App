import api from './client';
import type { Document, SignatureField } from '../types';

export const uploadDocument = async (file: File, title: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    // Append title as a query parameter or form data depending on backend expectation
    // Looking at backend/routers/documents.py:
    // @router.post("/upload")
    // async def upload_document(title: str, file: UploadFile = File(...), ...)
    // FastAPI expects 'title' as a query param by default if not specified as Form(), 
    // BUT since we are sending multipart/form-data, it's best to send it as query param 
    // unless backend explicitly uses Form(). 
    // Let's check backend again or stick to query param for safety as seen in test_docs.py:
    // "/api/docs/upload?title=My%20Contract"

    const response = await api.post<Document>(`/api/docs/upload?title=${encodeURIComponent(title)}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getDocuments = async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/api/docs/');
    return response.data;
};

export const getDocument = async (id: number): Promise<Document> => {
    const response = await api.get<Document>(`/api/docs/${id}`);
    return response.data;
};

export const addSignatureField = async (documentId: number, field: Omit<SignatureField, 'id' | 'document_id' | 'status'>): Promise<SignatureField> => {
    const response = await api.post<SignatureField>(`/api/docs/${documentId}/fields`, field);
    return response.data;
};

export const sendDocument = async (documentId: number): Promise<Document> => {
    const response = await api.put<Document>(`/api/docs/${documentId}/send`);
    return response.data;
};

export const signSignatureField = async (documentId: number, fieldId: number, signatureData: string): Promise<SignatureField> => {
    console.log(`API: signSignatureField called for doc ${documentId}, field ${fieldId}`);
    try {
        const response = await api.post<SignatureField>(`/api/docs/${documentId}/fields/${fieldId}/sign`, {
            signature_data: signatureData
        });
        console.log(`API: signSignatureField SUCCESS for field ${fieldId}`);
        return response.data;
    } catch (error) {
        console.error(`API: signSignatureField FAILED for field ${fieldId}`, error);
        throw error;
    }
};

export const deleteSignatureField = async (documentId: number, fieldId: number): Promise<void> => {
    await api.delete(`/api/docs/${documentId}/fields/${fieldId}`);
};

export const updateSignatureField = async (documentId: number, fieldId: number, data: { signer_email?: string }): Promise<SignatureField> => {
    const response = await api.patch<SignatureField>(`/api/docs/${documentId}/fields/${fieldId}`, data);
    return response.data;
};

export const recallDocument = async (documentId: number): Promise<Document> => {
    const response = await api.post<Document>(`/api/docs/${documentId}/recall`);
    return response.data;
};

export const getPublicDocument = async (token: string): Promise<Document> => {
    const response = await api.get<Document>(`/api/docs/public/${token}`);
    return response.data;
};

export const signPublicField = async (token: string, fieldId: number, signatureData: string): Promise<SignatureField> => {
    const response = await api.post<SignatureField>(`/api/docs/public/${token}/fields/${fieldId}/sign`, {
        signature_data: signatureData
    });
    return response.data;
};

export const declineDocument = async (id: number, reason: string): Promise<Document> => {
    const response = await api.post<Document>(`/api/docs/${id}/decline`, null, {
        params: { reason }
    });
    return response.data;
};

export const declinePublicDocument = async (token: string, reason: string): Promise<Document> => {
    const response = await api.post<Document>(`/api/docs/public/${token}/decline`, null, {
        params: { reason }
    });
    return response.data;
};
