import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '../components/ui/Button';
import { getDocument, addSignatureField, sendDocument, deleteSignatureField, updateSignatureField } from '../api/documents';
import type { Document, SignatureField } from '../types';
import { Loader2, Send, Type, X, History } from 'lucide-react';
import { HistorySidebar } from '../components/HistorySidebar';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface DraggableToolProps {
    type: 'signature';
    activeTool: 'signature' | null;
}

const DraggableTool = ({ type, activeTool }: DraggableToolProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'field_tool',
        item: { type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={(node) => { drag(node); }}
            className={`
                p-3 rounded-lg border-2 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all
                ${isDragging ? 'opacity-20 border-blue-500 bg-blue-500/10' : 'border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800'}
                ${activeTool === 'signature' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-500/5' : 'border-dashed'}
            `}
        >
            <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${activeTool === 'signature' ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500/20 text-blue-400'}`}>
                <Type className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
                <p className={`text-sm font-bold transition-colors ${activeTool === 'signature' ? 'text-blue-400' : 'text-white'}`}>Signature Box</p>
                <p className="text-[10px] text-gray-500">{activeTool === 'signature' ? 'Active: Click on PDF' : 'Drag or Click to place'}</p>
            </div>
            {activeTool === 'signature' && (
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
        </div>
    );
};

interface DropPageProps {
    pageNumber: number;
    activeTool: 'signature' | null;
    onDrop: (x: number, y: number, pageNumber: number) => void;
    children: React.ReactNode;
}

const DropPage = ({ pageNumber, activeTool, onDrop, children }: DropPageProps) => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'field_tool',
        drop: (item, monitor) => {
            console.log("Drop detected on page:", pageNumber, "Item:", item);
            const offset = monitor.getClientOffset();
            if (offset && pageRef.current) {
                const rect = pageRef.current.getBoundingClientRect();
                const x = offset.x - rect.left;
                const y = offset.y - rect.top;
                console.log("Calculated drop coordinates:", x, y);
                onDrop(x, y, pageNumber);
            } else {
                console.warn("Drop offset or pageRef missing", { offset, pageRef: !!pageRef.current });
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [pageNumber, onDrop]);

    return (
        <div
            ref={(node) => {
                drop(node);
                if (node) (pageRef as any).current = node;
            }}
            className={`drop-page-container relative mb-8 bg-white shadow-xl transition-all ${isOver ? 'ring-4 ring-blue-500 ring-inset opacity-90' : ''}`}
        >
            {children}

            {/* Explicit Placement Overlay when Tool is Active */}
            {activeTool === 'signature' && (
                <div
                    className="absolute inset-0 z-[50] cursor-crosshair bg-white/10 backdrop-blur-[1px] hover:bg-blue-500/20 flex flex-col items-center justify-center transition-all group border-4 border-blue-500/50 rounded-lg overflow-hidden"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        console.log("Overlay Click Resolved:", { x, y, pageNumber });
                        onDrop(x, y, pageNumber);
                    }}
                >
                    <div className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center gap-4 border-4 border-white/30 animate-[bounce_2s_infinite] transform hover:scale-110 transition-transform">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Type className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="font-black text-xl leading-tight">PLACE SIGNATURE</p>
                            <p className="text-xs text-blue-100 font-medium">Click exactly where you want it</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-300 font-medium bg-gray-900/60 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Coordinates: Click anywhere on this page
                    </div>
                </div>
            )}
        </div>
    );
};

export const SignatureStudio = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTool, setActiveTool] = useState<'signature' | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleDrop = async (x: number, y: number, pageNum: number) => {
        if (!document) return;
        setIsSaving(true);
        setError(null);
        console.log("Attempting to add field:", { documentId: document.id, pageNum, x, y });
        try {
            const newField = await addSignatureField(document.id, {
                page_number: pageNum,
                x_position: x,
                y_position: y,
                width: 150,
                height: 60,
                signer_email: "",
            });
            console.log("Field added successfully:", newField);
            setFields(prev => [...prev, newField]);
            setActiveTool(null);
        } catch (error: any) {
            console.error("Failed to add field", error);
            setError(error.response?.data?.detail || error.message || "Failed to add field");
            alert("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSend = async () => {
        if (!document) return;
        setIsSaving(true);
        try {
            await sendDocument(document.id);
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Failed to send", error);
            setError(error.response?.data?.detail || error.message || "Failed to send document");
            alert("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8 mt-20"><Loader2 className="animate-spin text-blue-500" /></div>;
    if (!document) return <div className="text-white p-8">Document not found</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-950">
            {/* Sidebar */}
            <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-lg font-bold text-white">Add Fields</h2>
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors"
                            title="View History"
                        >
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">Drag elements onto the document to prepare it for signing.</p>

                    {error && (
                        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-[10px] text-red-500 animate-pulse">
                            Error: {error}
                        </div>
                    )}
                </div>

                <div className="flex-1 p-4 flex flex-col gap-4">
                    <div
                        onClick={() => setActiveTool(activeTool === 'signature' ? null : 'signature')}
                        className="cursor-pointer"
                    >
                        <DraggableTool type="signature" activeTool={activeTool} />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                    <Button
                        className="w-full shadow-lg shadow-blue-500/20"
                        onClick={handleSend}
                        disabled={fields.length === 0 || isSaving}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Send for Signature
                    </Button>
                </div>
            </aside>

            {/* Main Content (PDF Viewer) */}
            <main className="flex-1 overflow-auto bg-gray-800/20 p-8 flex justify-center custom-scrollbar">
                <div className="max-w-4xl w-full flex justify-center">
                    <PDFDocument
                        file={`http://127.0.0.1:8000/${document.file_path.replace(/\\/g, '/')}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.error("PDF Load Error:", error)}
                        loading={<Loader2 className="animate-spin text-blue-500" />}
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <DropPage
                                key={`page_drop_${index + 1}`}
                                pageNumber={index + 1}
                                activeTool={activeTool}
                                onDrop={handleDrop}
                            >
                                <Page
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={800}
                                    className="shadow-xl pointer-events-none select-none"
                                />
                                {fields
                                    .filter(f => f.page_number === index + 1)
                                    .map(field => (
                                        <div
                                            key={field.id}
                                            style={{
                                                position: 'absolute',
                                                left: field.x_position,
                                                top: field.y_position,
                                                width: field.width,
                                                height: field.height,
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 10
                                            }}
                                            className="bg-blue-500/20 border-2 border-blue-500 flex flex-col items-center justify-center rounded group cursor-default transition-all hover:bg-blue-500/30"
                                        >
                                            {/* Delete Button */}
                                            <button
                                                onClick={async () => {
                                                    if (!document) return;
                                                    await deleteSignatureField(document.id, field.id);
                                                    setFields(fields.filter(f => f.id !== field.id));
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>

                                            <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 bg-gray-900/80 px-2 py-0.5 rounded border border-blue-500/50 mb-1">
                                                Signature
                                            </span>

                                            {/* Signer Email Input */}
                                            <input
                                                type="email"
                                                placeholder="Recipient email..."
                                                defaultValue={field.signer_email || ''}
                                                onBlur={async (e) => {
                                                    if (!document) return;
                                                    const newVal = e.target.value;
                                                    if (newVal !== (field.signer_email || '')) {
                                                        const updated = await updateSignatureField(document.id, field.id, { signer_email: newVal });
                                                        setFields(fields.map(f => f.id === field.id ? updated : f));
                                                    }
                                                }}
                                                className="text-[9px] w-[90%] bg-gray-950/80 border border-gray-700/50 rounded px-1 py-0.5 text-blue-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    ))
                                }
                            </DropPage>
                        ))}
                    </PDFDocument>
                </div>
            </main>

            <HistorySidebar
                logs={document?.audit_logs || []}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
};
