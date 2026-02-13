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
            
            # Convert base64 to image
            try:
                # Handle data:image/png;base64,... format
                header, encoded = field.signature_data.split(",", 1)
                img_bytes = base64.b64decode(encoded)
                
                # Signature boxes are centered in frontend: translate(-50%, -50%)
                center_x = field.x_position * scale_factor
                center_y = field.y_position * scale_factor
                width = field.width * scale_factor
                height = field.height * scale_factor
                
                # Rect for fitz: [x0, y0, x1, y1]
                x0 = center_x - (width / 2)
                y0 = center_y - (height / 2)
                x1 = center_x + (width / 2)
                y1 = center_y + (height / 2)
                
                rect = fitz.Rect(x0, y0, x1, y1)
                page.insert_image(rect, stream=img_bytes)
                print(f"DEBUG: Inserted signature into field {field.id}")
            except Exception as e:
                print(f"DEBUG: Error merging field {field.id}: {str(e)}")

        # Save signed document
        signed_filename = f"signed_{os.path.basename(pdf_path)}"
        signed_path = os.path.join("uploads", signed_filename)
        doc.save(signed_path)
        doc.close()
        
        document.signed_file_path = signed_path
        db.commit()
        print(f"DEBUG: Signed PDF saved to {signed_path}")
        return signed_path
    except Exception as e:
        print(f"DEBUG: CRITICAL error during PDF processing: {str(e)}")
        return None
