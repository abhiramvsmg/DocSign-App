import fitz
import base64
import os
from sqlalchemy.orm import Session
from .. import models

def merge_signatures(document_id: int, db: Session):
    print(f"DEBUG: Processing PDF merge for document {document_id}")
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        print(f"DEBUG: Document {document_id} not found for merging")
        return None

    # Load original PDF
    pdf_path = document.file_path
    if not os.path.exists(pdf_path):
        print(f"DEBUG: Original PDF not found at {pdf_path}")
        return None

    try:
        doc = fitz.open(pdf_path)
        
        # Process each signature field
        for field in document.signature_fields:
            if field.status != "signed" or not field.signature_data:
                continue
                
            # Standardized coordinate scaling (matching 800px width from frontend)
            # fitz page coordinates are in points (1 point = 1/72 inch)
            page = doc[field.page_number - 1]
            page_rect = page.rect
            scale_factor = page_rect.width / 800

