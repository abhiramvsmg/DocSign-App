import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, FileText, CheckCircle2, Download, Share2, X, Search, Filter } from 'lucide-react';
import { UploadModal } from '../components/UploadModal';
import { getDocuments, recallDocument } from '../api/documents';
import type { Document, DocumentStatus } from '../types';

export const Documents = () => {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filteredDocuments = documents
        .filter(d => statusFilter === 'all' || d.status === statusFilter)
        .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Documents</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage all your documents in one place</p>
                </div>
                <Button onClick={() => setIsUploadModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>
            </div>

            {/* Documents List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Documents ({filteredDocuments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-800 rounded-lg">
                            <FileText className="w-16 h-16 text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg mb-2">No documents found</p>
                            <p className="text-gray-500 text-sm mb-4">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Upload your first document to get started'}
                            </p>
                            <Button onClick={() => setIsUploadModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredDocuments.map((doc) => (
                                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-all group">
                                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                        <div className={`p-3 rounded-lg ${doc.status === 'completed' ? 'bg-green-500/10' :
                                            doc.status === 'declined' ? 'bg-red-500/10' :
                                                doc.status === 'pending' ? 'bg-yellow-500/10' :
                                                    'bg-blue-500/10'
                                            }`}>
                                            <FileText className={`w-6 h-6 ${doc.status === 'completed' ? 'text-green-500' :
                                                doc.status === 'declined' ? 'text-red-500' :
                                                    doc.status === 'pending' ? 'text-yellow-500' :
                                                        'text-blue-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white flex items-center gap-2">
                                                {doc.title}
                                                {doc.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                {doc.status === 'declined' && <X className="w-4 h-4 text-red-500" />}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span>{formatDate(doc.created_at)}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                <span className={`capitalize font-medium ${doc.status === 'completed' ? 'text-green-500' :
                                                    doc.status === 'declined' ? 'text-red-400' :
                                                        doc.status === 'pending' ? 'text-yellow-400' :
                                                            'text-blue-400'
                                                    }`}>{doc.status}</span>
                                                {doc.signature_fields && doc.signature_fields.length > 0 && (
                                                    <>
                                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                        <span>{doc.signature_fields.filter(f => f.status === 'signed').length}/{doc.signature_fields.length} signed</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {doc.status === 'draft' && (
                                            <Button size="sm" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                                                Prepare
                                            </Button>
                                        )}
                                        {doc.status === 'pending' && (
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
                                        )}
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
                    )}
                </CardContent>
            </Card>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchDocuments}
            />
        </div>
    );
};
