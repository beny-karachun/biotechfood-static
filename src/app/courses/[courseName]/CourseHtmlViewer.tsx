// src/app/courses/[courseName]/CourseHtmlViewer.tsx
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-is-mobile';

interface CourseHtmlViewerProps {
  files: string[]; // Contains paths to both .html and .pdf files
}

/**
 * Auto-resizing iframe that never shows a scrollbar.
 * Uses ResizeObserver + MutationObserver to continuously track
 * content height changes (e.g. collapsible sections opening).
 */
function IframeAutoHeight({ src, title }: { src: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const body = iframe.contentWindow?.document.body;
      const html = iframe.contentWindow?.document.documentElement;
      if (body && html) {
        const contentHeight = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.scrollHeight, html.offsetHeight
        );
        const currentHeight = parseInt(iframe.style.height) || 0;
        // Only GROW the iframe (content expanded), never shrink from minor fluctuations.
        // Only shrink if content got significantly shorter (>50px) — e.g. section collapsed.
        if (contentHeight > currentHeight || (currentHeight - contentHeight) > 50) {
          iframe.style.height = `${contentHeight}px`;
        }
      }
    } catch {
      iframe.style.height = '100vh';
    }
  }, []);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    syncHeight();

    try {
      const iframeDoc = iframe.contentWindow?.document;
      const iframeBody = iframeDoc?.body;
      if (!iframeDoc || !iframeBody) return;

      // Hide scrollbar inside the iframe content
      const style = iframeDoc.createElement('style');
      style.textContent = `
        html, body {
          overflow: hidden !important;
          overflow-x: hidden !important;
          overflow-y: hidden !important;
        }
        *, *::before, *::after {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      iframeDoc.head.appendChild(style);

      // ResizeObserver — fires when any element inside changes size
      const resizeObserver = new ResizeObserver(() => {
        syncHeight();
      });
      resizeObserver.observe(iframeBody);

      // MutationObserver — fires when DOM changes (e.g. section expanded)
      const mutationObserver = new MutationObserver(() => {
        // Small delay to let CSS transitions/animations complete
        requestAnimationFrame(() => syncHeight());
      });
      mutationObserver.observe(iframeBody, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'open', 'hidden'],
      });

      // Cleanup on unmount (handled by React re-keying)
    } catch {
      // Cross-origin — can't observe
    }
  }, [syncHeight]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      scrolling="no"
      onLoad={handleLoad}
      style={{
        width: '100%',
        minHeight: '200px',
        border: 'none',
        overflow: 'hidden',
        display: 'block',
      }}
    />
  );
}

// Simple helpers to replace Node.js path module on client side
function getExtension(filePath: string): string {
  const lastDot = filePath.lastIndexOf('.');
  return lastDot >= 0 ? filePath.substring(lastDot).toLowerCase() : '';
}

function getBasename(filePath: string, ext?: string): string {
  const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  let name = lastSlash >= 0 ? filePath.substring(lastSlash + 1) : filePath;
  if (ext && name.endsWith(ext)) {
    name = name.substring(0, name.length - ext.length);
  }
  return name;
}

export default function CourseHtmlViewer({ files }: CourseHtmlViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'html' | 'pdf' | null>(null);
  const isMobile = useIsMobile();

  // Separate files into PDF and HTML lists
  const { pdfFiles, htmlFiles } = useMemo(() => {
    const pdfs: string[] = [];
    const htmls: string[] = [];
    files.forEach(file => {
      const ext = getExtension(file);
      if (ext === '.pdf') {
        pdfs.push(file);
      } else if (ext === '.html') {
        htmls.push(file);
      }
    });
    return { pdfFiles: pdfs, htmlFiles: htmls };
  }, [files]);

  // Automatically select the first PDF, or the first HTML if no PDFs exist
  useEffect(() => {
    const firstFile = pdfFiles.length > 0 ? pdfFiles[0] : htmlFiles.length > 0 ? htmlFiles[0] : null;
    if (firstFile && (!selectedFile || !files.includes(selectedFile))) {
      setSelectedFile(firstFile);
      setFileType(getExtension(firstFile) === '.pdf' ? 'pdf' : 'html');
    }
    if (files.length === 0) {
      setSelectedFile(null);
      setFileType(null);
    }
  }, [files, pdfFiles, htmlFiles, selectedFile]);

  // Function to extract a display-friendly name from the file path (without extension type)
  const getDisplayName = (filePath: string) => {
    const extension = getExtension(filePath);
    const decodedFileName = decodeURIComponent(getBasename(filePath, extension));
    return decodedFileName.replace(/[_\-]/g, ' ');
  };

  const handleSelectFile = (file: string) => {
    setSelectedFile(file);
    setFileType(getExtension(file) === '.pdf' ? 'pdf' : 'html');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
        {/* PDF Section */}
        {pdfFiles.length > 0 && (
          <div className="flex-1 min-w-0 sm:min-w-[280px]">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">PDFs</h2>
            <Select
              onValueChange={handleSelectFile}
              value={fileType === 'pdf' && selectedFile ? selectedFile : undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a PDF" />
              </SelectTrigger>
              <SelectContent>
                {pdfFiles.map((file) => (
                  <SelectItem key={file} value={file}>
                    {getDisplayName(file)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* HTML Section */}
        {htmlFiles.length > 0 && (
          <div className="flex-1 min-w-0 sm:min-w-[280px]">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">Interactive Material</h2>
            <Select
              onValueChange={handleSelectFile}
              value={fileType === 'html' && selectedFile ? selectedFile : undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an interactive material" />
              </SelectTrigger>
              <SelectContent>
                {htmlFiles.map((file) => (
                  <SelectItem key={file} value={file}>
                    {getDisplayName(file)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Viewer Section */}
      {selectedFile && (
        <div className="mt-6 border rounded-lg overflow-hidden">
          {fileType === 'html' ? (
            <IframeAutoHeight
              key={selectedFile}
              src={selectedFile}
              title={getDisplayName(selectedFile)}
            />
          ) : fileType === 'pdf' ? (
            isMobile ? (
              // Mobile: PDF embed doesn't work on iOS Safari — show a button to open in new tab
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4 bg-muted/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-muted-foreground text-sm">
                  PDF viewing is not supported in mobile browsers.<br />
                  Tap below to open or download the file.
                </p>
                <Button
                  onClick={() => window.open(selectedFile, '_blank')}
                  className="px-6 py-3"
                >
                  Open PDF
                </Button>
              </div>
            ) : (
              // Desktop: embed normally
              <embed
                key={selectedFile}
                src={selectedFile}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '104vh',
                  border: 'none'
                }}
              />
            )
          ) : (
            <p>Selected file type not supported.</p>
          )}
        </div>
      )}
    </div>
  );
}
