from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from database import Base
import enum

class DocumentStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    COMPLETED = "completed"
    DECLINED = "declined"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    file_path = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    signed_file_path = Column(String, nullable=True)
    signing_token = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="documents")
    signature_fields = relationship("SignatureField", back_populates="document", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="document", cascade="all, delete-orphan")

class SignatureField(Base):
    __tablename__ = "signature_fields"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    page_number = Column(Integer, nullable=False)
    x_position = Column(Float, nullable=False)
    y_position = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    signer_email = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, signed
    signature_data = Column(String, nullable=True) # Base64 or SVG data

    document = relationship("Document", back_populates="signature_fields")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    action = Column(String, nullable=False) # upload, send, sign, recall, download
    user_id = Column(Integer, ForeignKey("users.id"))
    details = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="audit_logs")
    user = relationship("User")
