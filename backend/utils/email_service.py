import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import List

# Email configuration (use environment variables in production)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
APP_URL = os.getenv("APP_URL", "http://localhost:5173")

def send_signing_request(
    signer_email: str,
    document_title: str,
    signing_token: str,
    sender_name: str = "DocSign App"
) -> bool:
    """
    Send an email to a signer with a link to sign the document.
    
    Args:
        signer_email: Email address of the signer
        document_title: Title of the document to be signed
        signing_token: Unique token for the signing link
        sender_name: Name of the person/app sending the request
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    
    # Skip if SMTP not configured
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"⚠️  SMTP not configured. Signing link: {APP_URL}/sign/{signing_token}")
        return False
    
    try:
        signing_link = f"{APP_URL}/sign/{signing_token}"
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Signature Request: {document_title}"
        msg['From'] = FROM_EMAIL
        msg['To'] = signer_email
        
        # HTML email body
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📝 Document Signature Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>You have been requested to sign the following document:</p>
                    <h2 style="color: #667eea;">{document_title}</h2>
                    <p>Please click the button below to review and sign the document:</p>
                    <div style="text-align: center;">
                        <a href="{signing_link}" class="button">Sign Document</a>
                    </div>
                    <p style="font-size: 14px; color: #666;">Or copy this link: <br><a href="{signing_link}">{signing_link}</a></p>
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">This link is valid for 30 days. If you did not expect this email, please ignore it.</p>
                </div>
                <div class="footer">
                    <p>Sent by {sender_name} via DocSign App</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text fallback
        text_body = f"""
        Document Signature Request
        
        You have been requested to sign: {document_title}
        
        Click here to sign: {signing_link}
        
        This link is valid for 30 days.
        
        Sent by {sender_name} via DocSign App
        """
        
        part1 = MIMEText(text_body, 'plain')
        part2 = MIMEText(html_body, 'html')
        
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, signer_email, msg.as_string())
        
        print(f"✅ Email sent to {signer_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email to {signer_email}: {str(e)}")
        return False


def send_bulk_signing_requests(
    signers: List[str],
    document_title: str,
    signing_token: str,
    sender_name: str = "DocSign App"
) -> dict:
    """
    Send signing requests to multiple signers.
    
    Returns:
        dict: {"success": int, "failed": int, "total": int}
    """
    results = {"success": 0, "failed": 0, "total": len(signers)}
    
    for signer_email in signers:
        if send_signing_request(signer_email, document_title, signing_token, sender_name):
            results["success"] += 1
        else:
            results["failed"] += 1
    
    return results
