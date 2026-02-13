import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, FileText, Clock, CheckCircle2, Download, Share2, X, Search } from 'lucide-react';
import { UploadModal } from '../components/UploadModal';
import { getDocuments, recallDocument } from '../api/documents';
import type { Document, DocumentStatus } from '../types';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDocuments = async () => {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Filter documents by status and search query
    const filteredDocuments = documents
        .filter(d => statusFilter === 'all' || d.status === statusFilter)
        .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <Button onClick={() => setIsUploadModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Document
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-800 gap-6">
                {(['all', 'draft', 'pending', 'completed', 'declined'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`pb-4 text-sm font-medium transition-colors relative capitalize ${statusFilter === status ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {status}
                        {statusFilter === status && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-800 rounded-lg">
                                <FileText className="w-12 h-12 text-gray-600 mb-2" />
                                <p className="text-gray-400">You have no recent documents.</p>
                                <Button variant="link" onClick={() => setIsUploadModalOpen(true)} className="mt-2">
                                    Upload your first document
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    {filteredDocuments
                                        .slice(0, 10).map((doc) => (
                                            <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-all group">
                                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                    <div className={`p-2 rounded-lg ${doc.status === 'completed' ? 'bg-green-500/10' :
                                                        doc.status === 'declined' ? 'bg-red-500/10' :
                                                            'bg-blue-500/10'
                                                        }`}>
                                                        <FileText className={`w-5 h-5 ${doc.status === 'completed' ? 'text-green-500' :
                                                            doc.status === 'declined' ? 'text-red-500' :
                                                                'text-blue-500'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white flex items-center gap-2">
                                                            {doc.title}
                                                            {doc.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                                            {doc.status === 'declined' && <X className="w-3 h-3 text-red-500" />}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{formatDate(doc.created_at)}</span>
                                                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                            <span className={`capitalize ${doc.status === 'completed' ? 'text-green-500' :
                                                                doc.status === 'declined' ? 'text-red-400 font-medium' :
                                                                    'text-blue-400'
                                                                }`}>{doc.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Action Buttons */}
                                                    {doc.status === 'draft' ? (
                                                        <Button size="sm" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                                                            Prepare
                                                        </Button>
                                                    ) : doc.status === 'pending' ? (
                                                        <>
                                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/sign`)}>
                                                                Sign
                                                            </Button>
                                                            {doc.signing_token && (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const url = `${window.location.origin}/sign/${doc.signing_token}`;
                                                                        navigator.clipboard.writeText(url);
                                                                        alert("Signing link copied!");
                                                                    }}
                                                                >
                                                                    <Share2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : null}

                                                    {doc.status === 'completed' && doc.signed_file_path && (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                const url = `http://127.0.0.1:8000/${doc.signed_file_path!.replace(/\\/g, '/')}`;
                                                                window.open(url, '_blank');
                                                            }}
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    )}

                                                    {(doc.status === 'pending' || doc.status === 'declined') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-500 hover:text-red-400"
                                                            onClick={async () => {
                                                                if (confirm('Recall this document to Draft?')) {
                                                                    try {
                                                                        await recallDocument(doc.id);
                                                                        fetchDocuments();
                                                                    } catch (error) {
                                                                        console.error("Recall failed", error);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Recall
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Placeholder Stats Cards */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {documents.filter(d => d.status === 'pending').length}
                            </div>
                            <p className="text-xs text-gray-500">Waiting for signatures</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {documents.filter(d => d.status === 'completed').length}
                            </div>
                            <p className="text-xs text-gray-500">Fully signed documents</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchDocuments}
            />
        </div>
    );
};

