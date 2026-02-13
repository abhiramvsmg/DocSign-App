import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../components/ui/Button';
import { getDocument, signSignatureField, recallDocument, declineDocument } from '../api/documents';
import type { Document, SignatureField } from '../types';
import { Loader2, Check, X, History } from 'lucide-react';
import { HistorySidebar } from '../components/HistorySidebar';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const SigningPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [activeFieldId, setActiveFieldId] = useState<number | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const sigCanvas = useRef<SignatureCanvas>(null);

    useEffect(() => {
        if (id) {
            getDocument(Number(id))
                .then(doc => {
                    setDocument(doc);
                    setFields(doc.signature_fields);
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleFieldClick = (field: SignatureField) => {
        if (field.status === 'signed') return;
        setActiveFieldId(field.id);
    };

    const handleSaveSignature = async () => {
        console.log("handleSaveSignature called");
        if (sigCanvas.current && activeFieldId && document) {
            console.log("sigCanvas, activeFieldId, and document are valid");
            // CRITICAL: getTrimmedCanvas() is crashing due to a dependency issue.
            // Using getCanvas() instead which is more stable in this environment.
            const data = sigCanvas.current.getCanvas().toDataURL('image/png');
            console.log("Signature data URL generated (length):", data.length);

            setIsSaving(true);
            setError(null);
            console.log("Saving signature for field:", activeFieldId, "doc:", document.id);

            try {
                // Call API to save signature
                console.log("Calling signSignatureField API...");
                const result = await signSignatureField(document.id, activeFieldId, data);
                console.log("API call successful, result:", result);

                // Optimistic update
                setFields(prev => {
                    const newFields = prev.map(f => f.id === activeFieldId ? { ...f, status: 'signed', signature_data: data } : f);
                    console.log("Updated fields state locally");
                    return newFields;
                });
                setActiveFieldId(null);
                console.log("Modal closed (activeFieldId set to null)");
            } catch (error: any) {
                console.error("Failed to save signature - FULL ERROR:", error);
                const errMsg = error.response?.data?.detail || error.message || "Failed to save signature";
                setError(errMsg);
                console.log("Error state set:", errMsg);
                alert("Error: " + errMsg);
            } finally {
                setIsSaving(false);
                console.log("isSaving set to false");
            }
        } else {
            console.warn("handleSaveSignature: missing required state", {
                sigCanvas: !!sigCanvas.current,
                activeFieldId,
                document: !!document
            });
        }
    };

    const handleClosePad = () => {
        setActiveFieldId(null);
    };

    const handleDecline = async () => {
        const reason = prompt("Please provide a reason for declining:");
        if (reason === null) return;

        setIsSaving(true);
        try {
            await declineDocument(document!.id, reason || "No reason provided");
            setDocument(prev => prev ? { ...prev, status: 'declined' } : null);
        } catch (error: any) {
            console.error("Decline failed", error);
            alert("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!document) return <div>Document not found</div>;

    if (document.status === 'declined') {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white p-4 text-center">
                <X className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-3xl font-bold mb-3">Document Declined</h1>
                <p className="text-gray-400 max-w-md">This document has been declined and can no longer be signed.</p>
                <Button variant="link" onClick={() => navigate('/dashboard')} className="mt-8">Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-[calc(100vh-64px)] bg-gray-900 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                <h1 className="text-white font-semibold">{document.title}</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        {fields.filter(f => f.status === 'signed').length} / {fields.length} Signed
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setIsHistoryOpen(true)}
                    >
                        <History className="w-4 h-4 mr-2" />
                        History
                    </Button>
                    {document.status !== 'draft' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={async () => {
                                if (confirm('Recall this document? This will clear all signatures and return it to Draft mode.')) {
                                    try {
                                        await recallDocument(document.id);
                                        navigate(`/documents/${document.id}/edit`);
                                    } catch (error) {
                                        console.error("Recall failed", error);
                                    }
                                }
                            }}
                        >
                            Recall to Edit
                        </Button>
                    )}
                    {document.status === 'pending' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={handleDecline}
                            disabled={isSaving}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                        </Button>
                    )}
                </div>
                <Button onClick={() => {
                    const allSigned = fields.every(f => f.status === 'signed');
                    if (!allSigned) {
                        if (confirm('Not all fields are signed. Are you sure you want to finish?')) {
                            navigate('/dashboard');
                        }
                    } else {
                        navigate('/dashboard');
                    }
                }}>
                    Finish
                </Button>
            </div>

            {/* Main Content (PDF) */}
            <div className="flex-1 overflow-auto p-8 flex justify-center relative bg-gray-800/50">
                <div className="relative shadow-2xl">
                    <PDFDocument
                        file={`http://127.0.0.1:8000/${document.file_path.replace(/\\/g, '/')}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.error("PDF Load Error:", error)}
                        className="max-w-full"
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <div key={`page_${index + 1}`} className="relative mb-4">
                                <Page
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={800}
                                />
                                {fields
                                    .filter(f => f.page_number === index + 1)
                                    .map(field => (
                                        <div
                                            key={field.id}
                                            onClick={() => handleFieldClick(field)}
                                            style={{
                                                position: 'absolute',
                                                left: field.x_position,
                                                top: field.y_position,
                                                width: field.width,
                                                height: field.height,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            className={`
                                                border-2 flex items-center justify-center cursor-pointer transition-colors
                                                ${field.status === 'signed'
                                                    ? 'bg-green-500/20 border-green-500'
                                                    : 'bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30'}
                                            `}
                                        >
                                            {field.status === 'signed' ? (
                                                field.signature_data ? (
                                                    <img src={field.signature_data} alt="Signature" className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs font-bold text-green-500">Signed</span>
                                                )
                                            ) : (
                                                <span className="text-xs font-bold text-yellow-500">Click to Sign</span>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </PDFDocument>
                </div>
            </div>

            {/* Signature Pad Modal */}
            {activeFieldId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-lg">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Sign Document</h3>
                            <button onClick={handleClosePad} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-gray-100">
                            <div className="border border-gray-300 rounded bg-white">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    onBegin={() => setIsCanvasEmpty(false)}
                                    onEnd={() => setIsCanvasEmpty(sigCanvas.current?.isEmpty() ?? true)}
                                    canvasProps={{ width: 480, height: 200, className: 'sigCanvas' }}
                                />
                            </div>
                            <div className="mt-2 text-xs text-center text-gray-500">Draw your signature above</div>

                            {error && (
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/50 rounded text-xs text-red-600 text-center animate-pulse">
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    console.log("Clear button clicked");
                                    sigCanvas.current?.clear();
                                    setIsCanvasEmpty(true);
                                }}
                                className="text-gray-600"
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={() => {
                                    console.log("Apply Signature button CLICKED");
                                    handleSaveSignature();
                                }}
                                disabled={isSaving || isCanvasEmpty}
                                isLoading={isSaving}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Apply Signature
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <HistorySidebar
                logs={document?.audit_logs || []}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
};
