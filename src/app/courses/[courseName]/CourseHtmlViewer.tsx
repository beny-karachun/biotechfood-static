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
 * MathJax v3 configuration snippet.
 * Inserted into every course HTML <head> BEFORE MathJax loads,
 * so that $...$ and $$...$$ delimiters are always recognized.
 */
const MATHJAX_CONFIG = `<script>
window.MathJax = {
  tex: {
    inlineMath:  [['$', '$'], ['\\\\(', '\\\\)']],
    displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
  },
  // Safe stubs: course HTML files may call MathJax.typesetPromise() on DOMContentLoaded,
  // BEFORE the MathJax library has finished loading asynchronously.
  // Without these stubs, window.MathJax is truthy (it's this config object),
  // so "if (window.MathJax) MathJax.typesetPromise(...)" crashes with TypeError,
  // halting all JavaScript execution and leaving interactive sections blank.
  // These stubs will be overridden once the real MathJax library loads.
  typesetPromise: function() { return Promise.resolve(); },
  typeset: function() {},
  typesetClear: function() {}
};
</script>`;

const MATHJAX_SCRIPT =
  '<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>';

/**
 * Pre-processes raw HTML to guarantee MathJax is present and properly configured.
 *  – Strips any existing `window.MathJax = { … }` config blocks (we replace with ours).
 *  – Strips the legacy polyfill.io tag (not needed for MathJax v3).
 *  – Injects our config right after <head> so it runs before the MathJax script.
 *  – Adds a <base> tag so relative asset paths still resolve correctly.
 *  – Adds the MathJax v3 script tag if the file doesn't already include one.
 *
 * IMPORTANT: All String.replace calls use replacer functions (not replacement strings)
 * to prevent JavaScript's special $-pattern interpretation ($&, $', $$, etc.)
 * from corrupting HTML content that contains dollar signs (e.g. MathJax formulas).
 */
function injectMathJax(html: string, baseHref: string): string {
  let out = html;

  // Remove any existing MathJax config blocks (we provide our own).
  // This regex ONLY matches <script> blocks that contain a `MathJax = {` assignment.
  // It will NOT match script tags that merely reference MathJax (e.g. `if (window.MathJax)`).
  // The regex uses a replacer function to avoid $-sign corruption.
  out = out.replace(
    /<script[^>]*>(?:(?!<\/script>)[\s\S])*?(?:window\.)?MathJax\s*=\s*\{[\s\S]*?<\/script>\s*/gi,
    () => ''
  );

  // Remove legacy polyfill.io (not needed for MathJax v3)
  out = out.replace(
    /<script[^>]*polyfill\.io[^>]*><\/script>\s*/g,
    () => ''
  );

  // Remove existing <base> tags to avoid conflicts
  out = out.replace(
    /<base[^>]*>\s*/gi,
    () => ''
  );

  // Inject <base> + MathJax config right after <head…>
  // using a replacer function to avoid String.replace parsing `$'` and `$$` within MATHJAX_CONFIG
  out = out.replace(
    /<head([^>]*)>/i,
    (_match, p1) => `<head${p1}>\n<base href="${baseHref}">\n${MATHJAX_CONFIG}`
  );

  // Add MathJax script if the file doesn't already load it
  // Using a replacer function to prevent $-sign corruption
  if (!/mathjax@3/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      () => `${MATHJAX_SCRIPT}\n</head>`
    );
  }

  return out;
}

/**
 * Auto-resizing iframe that never shows a scrollbar.
 * Fetches the HTML source, injects MathJax config, then loads via Blob URL.
 * Uses ResizeObserver + MutationObserver to continuously track
 * content height changes (e.g. collapsible sections opening).
 */
function IframeAutoHeight({ src, title }: { src: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blobSrc, setBlobSrc] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // --- Fetch, transform, and create Blob URL ---
  useEffect(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const absUrl = new URL(src, window.location.href);
    const baseHref = absUrl.href.substring(0, absUrl.href.lastIndexOf('/') + 1);

    fetch(src)
      .then((r) => r.text())
      .then((html) => {
        const processed = injectMathJax(html, baseHref);
        const url = URL.createObjectURL(
          new Blob([processed], { type: 'text/html' })
        );
        blobUrlRef.current = url;
        setBlobSrc(url);
      })
      .catch(() => {
        // Fallback: load original file directly
        setBlobSrc(src);
      });

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src]);

  // --- Height syncing ---
  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const body = iframe.contentWindow?.document.body;
      if (!body) return;
      // IMPORTANT: Only measure body.scrollHeight.
      // Do NOT use html.offsetHeight or html.scrollHeight — the <html> element
      // fills the iframe viewport, so its height equals iframe.style.height,
      // creating a circular dependency that causes infinite expansion.
      const contentHeight = body.scrollHeight;
      const currentHeight = parseInt(iframe.style.height) || 0;
      // Only update if there's an actual change (>1px threshold to avoid sub-pixel loops)
      if (Math.abs(contentHeight - currentHeight) > 1) {
        iframe.style.height = `${contentHeight}px`;
      }
    } catch {
      iframe.style.height = '100vh';
    }
  }, []);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentWindow?.document;
      const iframeBody = iframeDoc?.body;
      const iframeWindow = iframe.contentWindow as any;
      if (!iframeDoc || !iframeBody || !iframeWindow) return;

      // Critical CSS overrides to prevent infinite height expansion:
      // 1. min-height:0 on html/body — course files use min-height:100vh which
      //    creates a circular dependency (100vh = iframe height = measured height).
      // 2. overflow:hidden — prevents scrollHeight from growing beyond content.
      // 3. height:auto — ensures body sizes to content, not viewport.
      const style = iframeDoc.createElement('style');
      style.textContent = `
        html {
          height: auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }
        body {
          height: auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
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
        /* Mobile: make content fill the full iframe width */
        @media (max-width: 768px) {
          body {
            padding: 8px 4px !important;
          }
          .container {
            max-width: 100% !important;
            padding: 12px 8px !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
          .section {
            padding: 12px 8px !important;
            border-radius: 8px !important;
          }
        }
      `;
      iframeDoc.head.appendChild(style);

      // Function to set up observers (called after MathJax finishes)
      const setupObservers = () => {
        const resizeObserver = new ResizeObserver(() => {
          syncHeight();
        });
        resizeObserver.observe(iframeBody);

        const mutationObserver = new MutationObserver(() => {
          requestAnimationFrame(() => syncHeight());
        });
        mutationObserver.observe(iframeBody, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class', 'open', 'hidden'],
        });
      };

      // Wait for MathJax to load and typeset, then set up observers
      const waitForMathJax = (retries = 0) => {
        if (retries > 50) {
          // MathJax not found after 5 seconds — set up observers anyway
          syncHeight();
          setupObservers();
          return;
        }

        const MathJax = iframeWindow.MathJax;
        if (MathJax && MathJax.typesetPromise) {
          // MathJax is ready — re-typeset to ensure math renders
          MathJax.typesetPromise()
            .then(() => {
              syncHeight();
              setupObservers();
            })
            .catch(() => {
              syncHeight();
              setupObservers();
            });
        } else if (MathJax && MathJax.Hub) {
          // MathJax v2 fallback
          MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
          MathJax.Hub.Queue(() => {
            syncHeight();
            setupObservers();
          });
        } else {
          // MathJax not loaded yet — retry in 100ms
          setTimeout(() => waitForMathJax(retries + 1), 100);
        }
      };

      // Initial height sync, then wait for MathJax
      syncHeight();
      waitForMathJax();

    } catch {
      // Cross-origin — can't observe
      syncHeight();
    }
  }, [syncHeight]);

  if (!blobSrc) {
    // Still fetching / transforming — show nothing (flickers for <100ms)
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src={blobSrc}
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
        <div className="mt-6 border rounded-lg overflow-hidden sm:border sm:rounded-lg max-sm:border-0 max-sm:rounded-none max-sm:-mx-4">
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
