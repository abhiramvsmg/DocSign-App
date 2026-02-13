from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from .. import models, database
from ..schemas.document import (
    DocumentResponse, 
    SignatureFieldResponse, 
    SignatureFieldCreate, 
    SignatureFieldUpdate, 
    DocumentStatus,
    SignatureUpdate
)
from .auth import get_current_user
import shutil
import os
import uuid
from ..utils.pdf_processor import merge_signatures
import secrets

router = APIRouter(
    prefix="/api/docs",
    tags=["documents"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def create_audit_log(db: Session, document_id: int, user_id: int, action: str, details: str = None):
    log = models.AuditLog(
        document_id=document_id,
        user_id=user_id,
        action=action,
        details=details
    )
    db.add(log)
    db.commit()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    title: str,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_document = models.Document(
        title=title,
        file_path=file_path,
        user_id=current_user.id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Audit Log
    create_audit_log(db, db_document.id, current_user.id, "upload", f"Document '{title}' uploaded")
    
    return db_document

@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    return db.query(models.Document).filter(models.Document.user_id == current_user.id).all()

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.post("/{document_id}/fields", response_model=SignatureFieldResponse)
def add_signature_field(
    document_id: int,
    field: SignatureFieldCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    print(f"DEBUG: Adding field to document {document_id} for user {current_user.email}")
    print(f"DEBUG: Field data: {field}")
    
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        print(f"DEBUG: Document {document_id} not found")
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.user_id != current_user.id:
        print(f"DEBUG: User {current_user.email} not authorized for document {document_id}")
        raise HTTPException(status_code=403, detail="Not authorized")
        
    try:
        # Pydantic v2 uses model_dump(), v1 uses dict()
        field_data = field.model_dump() if hasattr(field, 'model_dump') else field.dict()
        db_field = models.SignatureField(**field_data, document_id=document_id)
        db.add(db_field)
        db.commit()
        db.refresh(db_field)
        print(f"DEBUG: Field created successfully with ID {db_field.id}")
        return db_field
    except Exception as e:
        print(f"DEBUG: Error creating field: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{document_id}/fields/{field_id}", status_code=204)
def delete_signature_field(
    document_id: int,
    field_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document or document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized or document not found")
        
    field = db.query(models.SignatureField).filter(
        models.SignatureField.id == field_id,
        models.SignatureField.document_id == document_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
        
    db.delete(field)
    db.commit()
    return None

@router.patch("/{document_id}/fields/{field_id}", response_model=SignatureFieldResponse)
def update_signature_field(
    document_id: int,
    field_id: int,
    update_data: SignatureFieldUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document or document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized or document not found")
        
    field = db.query(models.SignatureField).filter(
        models.SignatureField.id == field_id,
        models.SignatureField.document_id == document_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
        
    if update_data.signer_email is not None:
        field.signer_email = update_data.signer_email
        
    db.commit()
    db.refresh(field)
    return field

@router.put("/{document_id}/send", response_model=DocumentResponse)
def send_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if not document.signature_fields:
        raise HTTPException(status_code=400, detail="Document has no signature fields")

    document.status = models.DocumentStatus.PENDING
    
    # Generate signing token if not exists
    if not document.signing_token:
        document.signing_token = secrets.token_urlsafe(32)
        
    db.commit()
    db.refresh(document)
    
    # Audit Log for sending
    create_audit_log(db, document_id, current_user.id, "send", "Document sent for signing")
    
    # Send email notifications to signers
    try:
        from ..utils.email_service import send_signing_request
        unique_signers = set(f.signer_email for f in document.signature_fields if f.signer_email)
        for signer_email in unique_signers:
            send_signing_request(
                signer_email=signer_email,
                document_title=document.title,
                signing_token=document.signing_token,
                sender_name=current_user.full_name or current_user.email
            )
    except Exception as e:
        print(f"Email notification failed: {e}")
        # Don't fail the request if email fails
    
    return document

@router.get("/public/{token}", response_model=DocumentResponse)
def get_public_document(token: str, db: Session = Depends(database.get_db)):
    document = db.query(models.Document).filter(models.Document.signing_token == token).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.post("/public/{token}/fields/{field_id}/sign", response_model=SignatureFieldResponse)
def sign_public_signature_field(
    token: str,
    field_id: int,
    data: SignatureUpdate,
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.signing_token == token).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if document.status in [models.DocumentStatus.COMPLETED, models.DocumentStatus.DECLINED]:
        raise HTTPException(status_code=400, detail=f"Document is already {document.status}")
        
    field = db.query(models.SignatureField).filter(
        models.SignatureField.id == field_id,
        models.SignatureField.document_id == document.id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
        
    # Guest signing doesn't enforce signer_email check in the same way as internal,
    # but we can add a check if needed. For now, we allow signing if you have the token.
    # We should ideally ask for their name/email to log it.
    
    field.status = "signed"
    field.signature_data = data.signature_data
    db.commit()
    db.refresh(field)
    
    # Audit Log for guest signing
    create_audit_log(db, document.id, None, "sign", f"Signature applied via public link (Field {field_id})")
    
    # Trigger PDF merging if all fields are signed
    all_signed = all(f.status == "signed" for f in document.signature_fields)
    if all_signed:
        try:
            merge_signatures(document.id, db)
            db.refresh(document)
            create_audit_log(db, document.id, None, "complete", "Document fully signed and flattened")
        except Exception as e:
            print(f"Error merging signatures: {e}")
            
    return field

@router.post("/public/{token}/decline", response_model=DocumentResponse)
def decline_public_document(
    token: str,
    reason: str = "No reason provided",
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.signing_token == token).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    document.status = models.DocumentStatus.DECLINED
    db.commit()
    db.refresh(document)
    
    # Audit Log for guest declination
    create_audit_log(db, document.id, None, "decline", f"Document declined via public link. Reason: {reason}")
    
    return document

@router.post("/{document_id}/decline", response_model=DocumentResponse)
def decline_document(
    document_id: int,
    reason: str = "No reason provided",
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
         raise HTTPException(status_code=404, detail="Document not found")
         
    # Only if the user is a signer for this document
    is_signer = any(f.signer_email == current_user.email for f in document.signature_fields)
    
    if not is_signer and document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to decline this document")

    document.status = models.DocumentStatus.DECLINED
    db.commit()
    db.refresh(document)
    
    # Audit Log
    create_audit_log(db, document_id, current_user.id, "decline", f"Document declined. Reason: {reason}")
    
    return document

@router.post("/{document_id}/fields/{field_id}/sign", response_model=SignatureFieldResponse)
def sign_signature_field(
    document_id: int,
    field_id: int,
    data: SignatureUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    print(f"DEBUG: Signing field {field_id} in document {document_id}")
    try:
        # Verify field exists and belongs to document
        field = db.query(models.SignatureField).filter(
            models.SignatureField.id == field_id,
            models.SignatureField.document_id == document_id
        ).first()
        
        if not field:
            print(f"DEBUG: Field {field_id} not found in document {document_id}")
            raise HTTPException(status_code=404, detail="Signature field not found")
        
        # ENFORCE SIGNER EMAIL
        # If a signer email is assigned, check if it matches the current user
        if field.signer_email and field.signer_email.strip():
            if field.signer_email.lower() != current_user.email.lower():
                print(f"DEBUG: Signer mismatch. Expected {field.signer_email}, got {current_user.email}")
                raise HTTPException(
                    status_code=403, 
                    detail=f"Access denied. This field is assigned to {field.signer_email}"
                )
        
        # Update field
        print(f"DEBUG: Updating field status to signed and saving signature data (len: {len(data.signature_data)})")
        field.status = "signed"
        field.signature_data = data.signature_data
        db.commit()
        db.refresh(field)
        print(f"DEBUG: Field {field_id} updated successfully")

        # Audit Log for signing
        create_audit_log(db, document_id, current_user.id, "sign", f"Signature applied to field {field_id}")
        
        # Check if all fields in the document are signed
        all_fields = db.query(models.SignatureField).filter(models.SignatureField.document_id == document_id).all()
        if all(f.status == "signed" for f in all_fields):
            print(f"DEBUG: All fields signed for document {document_id}, marking as completed")
            document = db.query(models.Document).filter(models.Document.id == document_id).first()
            if document:
                document.status = models.DocumentStatus.COMPLETED
                db.commit()
                print(f"DEBUG: Document {document_id} marked as completed")
                # Trigger PDF merge
                merge_signatures(document_id, db)
                print(f"DEBUG: PDF merge triggered for document {document_id}")
                # Audit Log for completion
                create_audit_log(db, document_id, current_user.id, "complete", "All fields signed. Document flattened.")
                
        return field
    except Exception as e:
        print(f"DEBUG: Error signing field: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error during signing: {str(e)}")
@router.post("/{document_id}/recall", response_model=DocumentResponse)
def recall_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Revert status
    document.status = models.DocumentStatus.DRAFT
    document.signed_file_path = None
    
    # Reset all fields
    for field in document.signature_fields:
        field.status = "pending"
        field.signature_data = None
        
    db.commit()
    db.refresh(document)
    print(f"DEBUG: Document {document_id} recalled and reset to draft")
    
    # Audit Log for recall
    create_audit_log(db, document_id, current_user.id, "recall", "Document recalled to draft mode. Signatures cleared.")
    
    return document

@router.get("/{document_id}/audit", response_model=list)
def get_document_audit_logs(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get audit logs for a specific document"""
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    logs = db.query(models.AuditLog).filter(models.AuditLog.document_id == document_id).order_by(models.AuditLog.created_at.desc()).all()
    return logs
