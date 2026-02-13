import React from 'react';
import { Clock, Upload, Send, PenTool, RotateCcw, CheckCircle2, FileDown, X } from 'lucide-react';
import type { AuditLog } from '../types';

interface HistorySidebarProps {
    logs: AuditLog[];
    isOpen: boolean;
    onClose: () => void;
}

const actionIcons: Record<string, React.ReactNode> = {
    upload: <Upload className="w-4 h-4 text-blue-400" />,
    send: <Send className="w-4 h-4 text-indigo-400" />,
    sign: <PenTool className="w-4 h-4 text-yellow-400" />,
    recall: <RotateCcw className="w-4 h-4 text-red-400" />,
    complete: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    download: <FileDown className="w-4 h-4 text-purple-400" />,
};

export const HistorySidebar = ({ logs, isOpen, onClose }: HistorySidebarProps) => {
    // Sort logs by date descending
    const sortedLogs = logs ? [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];

    return (
        <div className={`fixed inset-y-0 right-0 w-80 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 ease-in-out z-[100] shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Document History
                </h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-64px)] p-6 space-y-8 scrollbar-hide">
                {sortedLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-500 italic">No activity recorded yet</p>
                    </div>
                ) : (
                    sortedLogs.map((log, index) => (
                        <div key={log.id} className="relative pl-8">
                            {/* Vertical line connector */}
                            {index !== sortedLogs.length - 1 && (
                                <div className="absolute left-[13px] top-7 bottom-[-32px] w-[2px] bg-gradient-to-b from-gray-700 to-transparent opacity-50" />
                            )}

                            <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center z-10 shadow-sm ring-4 ring-gray-950">
                                {actionIcons[log.action] || <Clock className="w-3.5 h-3.5 text-gray-400" />}
                            </div>

                            <div className="space-y-1.5 translate-y-[-2px]">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                        {log.action}
                                    </p>
                                    <span className="text-[10px] text-gray-500 tabular-nums font-medium">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    {log.details}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                                    <p className="text-[10px] text-gray-600 font-bold tracking-tight">
                                        {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
