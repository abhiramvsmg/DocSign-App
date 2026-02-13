import React, { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import { uploadDocument } from '../api/documents';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed');
                return;
            }
            setFile(selectedFile);
            setError(null);
            // Auto-fill title with filename if empty
            if (!title) {
                setTitle(selectedFile.name.replace('.pdf', ''));
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed');
                return;
            }
            setFile(droppedFile);
            setError(null);
            if (!title) {
                setTitle(droppedFile.name.replace('.pdf', ''));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsLoading(true);
        setError(null);

        try {
            await uploadDocument(file, title);
            onUploadSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to upload document');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setTitle('');
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Upload Document</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* File Drop Zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                            file
                                ? "border-blue-500 bg-blue-500/5"
                                : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                        )}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <div className="flex flex-col items-center text-center">
                                <FileText className="w-12 h-12 text-blue-500 mb-2" />
                                <span className="text-sm font-medium text-white">{file.name}</span>
                                <span className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <Upload className="w-12 h-12 text-gray-500 mb-2" />
                                <span className="text-sm font-medium text-gray-300">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500 mt-1">PDF (MAX. 10MB)</span>
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Document Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Service Agreement"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!file || !title || isLoading} isLoading={isLoading}>
                            Upload
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
