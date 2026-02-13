# Temporary simplified version for deployment without PyMuPDF
# TODO: Add back PDF merging with alternative solution or different platform

import base64
import os
from sqlalchemy.orm import Session
from .. import models

def merge_signatures(document_id: int, db: Session):
    """
    Simplified version for deployment.
    Marks document as completed without actual PDF merging.
    TODO: Implement PDF merging using cloud service or different library.
    """
    print(f"DEBUG: Processing document {document_id} (PDF merge disabled for deployment)")
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        print(f"DEBUG: Document {document_id} not found")
        return None

    # Verify all signatures are present
    all_signed = all(f.status == "signed" for f in document.signature_fields)
    if not all_signed:
        print(f"DEBUG: Not all fields are signed yet")
        return None
    
    # Mark document as completed
    # In production, this would merge signatures into PDF
    document.status = models.DocumentStatus.COMPLETED
    document.signed_file_path = document.file_path  # Use original for now
    db.commit()
    
    print(f"DEBUG: Document {document_id} marked as completed (PDF merge pending)")
    return document.file_path

