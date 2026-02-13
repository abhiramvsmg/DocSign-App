import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../components/ui/Button';
import { getPublicDocument, signPublicField, declinePublicDocument } from '../api/documents';
import type { Document, SignatureField } from '../types';
import { Loader2, Check, X, History } from 'lucide-react';
import { HistorySidebar } from '../components/HistorySidebar';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const PublicSigningPage = () => {
    const { token } = useParams<{ token: string }>();
    const [document, setDocument] = useState<Document | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [activeFieldId, setActiveFieldId] = useState<number | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const sigCanvas = useRef<SignatureCanvas>(null);

    useEffect(() => {
        if (token) {
            getPublicDocument(token)
                .then(doc => {
                    setDocument(doc);
                    setFields(doc.signature_fields);
                })
                .catch(err => {
                    console.error("Failed to load public document", err);
                    setError("This link is invalid or has expired.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [token]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleFieldClick = (field: SignatureField) => {
        if (field.status === 'signed' || isFinished) return;
        setActiveFieldId(field.id);
    };

    const handleSaveSignature = async () => {
        if (sigCanvas.current && activeFieldId && token) {
            const data = sigCanvas.current.getCanvas().toDataURL('image/png');
            setIsSaving(true);
            setError(null);

            try {
                await signPublicField(token, activeFieldId, data);

                // Optimistic update
                const updatedFields = fields.map(f => f.id === activeFieldId ? { ...f, status: 'signed', signature_data: data } : f);
                setFields(updatedFields);
                setActiveFieldId(null);

                // Check if all fields are signed
                if (updatedFields.every(f => f.status === 'signed')) {
                    setIsFinished(true);
                }
            } catch (error: any) {
                console.error("Failed to save signature", error);
                setError(error.response?.data?.detail || error.message || "Failed to save signature");
                alert("Error: " + (error.response?.data?.detail || error.message));
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDecline = async () => {
        const reason = prompt("Please provide a reason for declining:");
        if (reason === null) return; // User cancelled prompt

        setIsSaving(true);
        try {
            await declinePublicDocument(token!, reason || "No reason provided");
            setDocument(prev => prev ? { ...prev, status: 'declined' } : null);
        } catch (error: any) {
            console.error("Decline failed", error);
            alert("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-900"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;

    if (error && !document) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white p-4">
                <X className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    if (!document) return <div className="text-white bg-gray-900 h-screen flex items-center justify-center">Document not found</div>;

    if (document.status === 'declined') {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white p-4 text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                    <X className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Document Declined</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    You have formally declined to sign <strong>{document.title}</strong>. The requester has been notified.
                </p>
                <p className="text-sm text-gray-500">You can now close this tab.</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white p-4 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce">
                    <Check className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Signing Complete!</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Thank you for signing <strong>{document.title}</strong>. Your signature has been securely recorded and the document owner has been notified.
                </p>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
                    <p className="text-sm text-gray-400">You can now close this tab safely.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-screen bg-gray-950 overflow-hidden">
            {/* Guest Header */}
            <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center z-10">
                <div className="flex flex-col">
                    <h1 className="text-white font-bold text-lg">{document.title}</h1>
                    <span className="text-xs text-gray-500">Public Signing Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-blue-400 border border-blue-400/20">
                        {fields.filter(f => f.status === 'signed').length} / {fields.length} Signed
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setIsHistoryOpen(true)}
                    >
                        <History className="w-4 h-4 mr-2" />
                        Audit Trail
                    </Button>
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
                </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gray-950">
                <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <PDFDocument
                        file={`http://127.0.0.1:8000/${document.file_path.replace(/\\/g, '/')}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="max-w-full"
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <div key={`page_${index + 1}`} className="relative mb-6 ring-1 ring-gray-800 rounded overflow-hidden">
                                <Page
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={window.innerWidth > 768 ? 800 : window.innerWidth - 40}
                                />
                                {fields
                                    .filter(f => f.page_number === index + 1)
                                    .map(field => (
                                        <div
                                            key={field.id}
                                            onClick={() => handleFieldClick(field)}
                                            style={{
                                                position: 'absolute',
                                                left: window.innerWidth > 768 ? field.x_position : (field.x_position * (window.innerWidth - 40) / 800),
                                                top: window.innerWidth > 768 ? field.y_position : (field.y_position * (window.innerWidth - 40) / 800),
                                                width: window.innerWidth > 768 ? field.width : (field.width * (window.innerWidth - 40) / 800),
                                                height: window.innerWidth > 768 ? field.height : (field.height * (window.innerWidth - 40) / 800),
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            className={`
                                                border-2 flex items-center justify-center cursor-pointer transition-all duration-300
                                                ${field.status === 'signed'
                                                    ? 'bg-green-500/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                                    : 'bg-blue-500/10 border-blue-500 border-dashed hover:bg-blue-500/20 hover:scale-105'}
                                            `}
                                        >
                                            {field.status === 'signed' ? (
                                                <img src={field.signature_data} alt="Signature" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase tracking-wider font-black text-blue-500">Sign Here</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </PDFDocument>
                </div>
            </div>

            {/* Floating Action Button for Finish (Visible when all signed) */}
            {fields.every(f => f.status === 'signed') && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 shadow-xl shadow-green-900/20 px-12 rounded-full font-bold"
                        onClick={() => setIsFinished(true)}
                    >
                        Complete Document
                    </Button>
                </div>
            )}

            {/* Signature Modal */}
            {activeFieldId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-xl">Apply Signature</h3>
                                <p className="text-xs text-gray-500">Draw your signature in the box below</p>
                            </div>
                            <button onClick={() => setActiveFieldId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden touch-none">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    onBegin={() => setIsCanvasEmpty(false)}
                                    onEnd={() => setIsCanvasEmpty(sigCanvas.current?.isEmpty() ?? true)}
                                    canvasProps={{ width: 400, height: 200, className: 'sigCanvas w-full cursor-crosshair' }}
                                />
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                                    <X className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    sigCanvas.current?.clear();
                                    setIsCanvasEmpty(true);
                                }}
                                className="flex-1"
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={handleSaveSignature}
                                disabled={isSaving || isCanvasEmpty}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                Finalize
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
