from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from enum import Enum

class DocumentStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    COMPLETED = "completed"
    DECLINED = "declined"

class SignatureFieldBase(BaseModel):
    page_number: int
    x_position: float
    y_position: float
    width: float
    height: float
    signer_email: Optional[str] = None

class SignatureFieldCreate(SignatureFieldBase):
    pass

class SignatureFieldUpdate(BaseModel):
    signer_email: Optional[str] = None

class SignatureUpdate(BaseModel):
    signature_data: str

class SignatureFieldResponse(SignatureFieldBase):
    id: int
    status: str
    signature_data: Optional[str] = None
    document_id: int

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    action: str
    details: Optional[str] = None
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    title: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    created_at: datetime
    user_id: int
    status: DocumentStatus
    signed_file_path: Optional[str] = None
    signing_token: Optional[str] = None
    signature_fields: List[SignatureFieldResponse] = []
    audit_logs: List[AuditLogResponse] = []

    class Config:
        from_attributes = True
