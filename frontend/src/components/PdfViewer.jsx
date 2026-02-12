import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Download } from 'lucide-react';
import api from '../api/axios';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use local worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            if (!url) return;
            setLoading(true);
            setError(null);
            try {
                // Ensure we use the proxy by making the URL relative if it points to the backend
                let fetchUrl = url;
                // Use a more robust regex to strip http://host:port/api if it exists
                fetchUrl = url.replace(/^https?:\/\/[^\/]+\/api/, '');

                const response = await api.get(fetchUrl, {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf'
                    }
                });

                if (response.data.size === 0) {
                    throw new Error("File is empty");
                }

                const blobUrl = URL.createObjectURL(response.data);
                setFileUrl(blobUrl);
            } catch (err) {
                console.error("Error fetching PDF blob:", err);
                setError("Impossible de charger le document.");
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();

        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [url]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col items-center w-full h-full bg-slate-100 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between w-full px-4 py-2 bg-white border-b border-slate-200 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                        Page {pageNumber} / {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                        className="p-1 hover:bg-slate-100 rounded"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs font-bold text-slate-600 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                        className="p-1 hover:bg-slate-100 rounded"
                    >
                        <ZoomIn size={18} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full overflow-auto flex justify-center p-4 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chargement du CV...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-rose-500">
                        <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                    </div>
                ) : (
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-xl"
                        />
                    </Document>
                )}
            </div>
        </div>
    );
};

export default PdfViewer;
