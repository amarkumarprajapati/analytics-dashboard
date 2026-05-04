"use client";

import { useState, useCallback, useEffect } from "react";
import { UnifiedTopBar } from "@/components/layout/unified-topbar";
import { FileUpload } from "@/components/upload/file-upload";
import { AnalyzingLoader } from "@/components/upload/analyzing-loader";
import { CodeViewer } from "@/components/viewers/code-viewer";
import { TextViewer } from "@/components/viewers/text-viewer";
import { DataViewer } from "@/components/viewers/data-viewer";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UserActivityChart } from "@/components/dashboard/user-activity-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { ReportsModal } from "@/components/modals/reports-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { UploadModal } from "@/components/modals/upload-modal";
import { WelcomeTour } from "@/components/modals/welcome-tour";
import { DemoModal } from "@/components/modals/demo-modal";
import { FilesLibraryModal } from "@/components/modals/files-library-modal";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { FileText, Upload as UploadIcon, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

type ViewMode = "upload" | "data" | "code" | "text" | "analytics";

const PDF_JS_VERSION = "3.11.174";
const PDF_JS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}`;

// Load PDF.js from CDN at runtime - avoids all bundler/canvas/Turbopack issues
function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = `${PDF_JS_CDN}/pdf.min.js`;
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = `${PDF_JS_CDN}/pdf.worker.min.js`;
        resolve(lib);
      } else {
        reject(new Error("PDF.js failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
    document.head.appendChild(script);
  });
}

export default function Home() {
  const { currentFile, setCurrentFile, setIsAnalyzing, uploadedFiles, addFile } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>("upload");
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileContent, setFileContent] = useState<any>(null);
  const [showReports, setShowReports] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [isAIChatExpanded, setIsAIChatExpanded] = useState(false);

  // Show welcome tour on first visit
  useEffect(() => {
    const tourDone = localStorage.getItem("tourCompleted");
    if (!tourDone) {
      setShowWelcomeTour(true);
    }
  }, []);

  useEffect(() => {
    if (currentFile && viewMode === "upload") {
      const ext = currentFile.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv', 'pdf'].includes(ext || '')) {
        setViewMode('analytics');
      } else if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json'].includes(ext || '')) {
        setViewMode('code');
      } else {
        setViewMode('text');
      }
      setFileContent(currentFile.data);
    }
  }, [currentFile]);

  const handleFileSelect = useCallback(async (file: File) => {
    setAnalyzing(true);
    setIsAnalyzing(true);
    setProgress(0);

    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // Process files sequentially based on extension
    if (['pdf'].includes(ext || '')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF.js from CDN at runtime (avoids all bundler/canvas issues)
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
           const page = await pdf.getPage(i);
           const textContent = await page.getTextContent();
           
           let lastY = -1;
           let pageText = "";
           for (const item of textContent.items) {
             const currentY = item.transform[5];
             
             // If Y coordinate changes by more than half the item height, it's a new line
             if (lastY !== -1 && Math.abs(lastY - currentY) > (item.height || 10) / 2) {
                pageText += "\n";
             }
             
             pageText += item.str;
             
             // If item explicitly has an end-of-line marker, add a newline
             if (item.hasEOL) {
                pageText += "\n";
             }
             
             lastY = currentY;
           }
           fullText += pageText + "\n\n";
        }
        
        finishUpload(file, fullText.trim() || "No visible text found in this PDF.", ext);
      } catch (err: any) {
        console.error("PDF Parsing error:", err);
        finishUpload(file, `Could not extract text from PDF: ${err?.message || "Unknown error"}`, ext);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        let parsedData: any = null;

        try {
          if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            parsedData = XLSX.utils.sheet_to_json(sheet);
          } else {
            parsedData = data; // Text or code
          }
        } catch (err) {
          console.error("Parsing error:", err);
        }
        finishUpload(file, parsedData, ext);
      };

      if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    }
  }, [addFile, setCurrentFile, setIsAnalyzing]);

  const finishUpload = (file: File, parsedData: any, ext: string | undefined) => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const fileData = {
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date(),
              data: parsedData,
            };
            
            addFile(fileData);
            setCurrentFile(fileData);
            setIsAnalyzing(false);
            setAnalyzing(false);

            const codeExts = ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json'];
            const dataExts = ['xlsx', 'xls', 'csv'];
            const pdfExts = ['pdf'];

            if (codeExts.includes(ext || '')) {
              setViewMode('code');
              setFileContent(parsedData);
            } else if (dataExts.includes(ext || '')) {
              setViewMode('analytics');
              setFileContent(parsedData);
            } else if (pdfExts.includes(ext || '')) {
              setViewMode('analytics');
              setFileContent(parsedData);
            } else {
              setViewMode('text');
              setFileContent(parsedData);
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleNewUpload = () => {
    setShowUpload(true);
  };

  const handleBackToUpload = () => {
    setViewMode("upload");
    setCurrentFile(null);
    setFileContent(null);
  };

  return (
    <>
      {analyzing && <AnalyzingLoader progress={progress} />}
      
      <div className="h-screen flex flex-col">
        <UnifiedTopBar
          onUploadClick={handleNewUpload}
          onSettingsClick={() => setShowSettings(true)}
          onReportsClick={() => setShowReports(true)}
          onBackClick={handleBackToUpload}
          showBackButton={viewMode !== "upload" && currentFile !== null}
        />

        <div className="flex-1 overflow-hidden p-6">
          {viewMode === "upload" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-start pt-8"
            >
              <div className="relative mb-6 text-center max-w-2xl px-4">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center border border-primary/20"
                >
                  <FileText className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-3xl lg:text-5xl font-black mb-4 tracking-tighter gradient-text">
                  Analyze Anything. <br />
                  <span className="text-foreground/90">Instantly.</span>
                </h1>
                <p className="text-base text-muted-foreground font-medium mb-6 leading-relaxed">
                  The professional command center for your data. Upload PDFs, Spreadsheets, Code, or Documents for instant neural analysis.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                   <Button size="lg" onClick={() => setShowUpload(true)} className="h-12 px-6 rounded-xl border border-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold gap-2">
                      <UploadIcon className="h-4 w-4" />
                      Upload Document
                   </Button>
                   <Button size="lg" variant="outline" onClick={() => setShowDemo(true)} className="h-12 px-6 rounded-xl border border-border text-base font-bold">
                      View Demo
                   </Button>
                </div>
              </div>

              <div className="w-full max-w-5xl mx-auto px-4 mt-4">
                 <div className="relative">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="py-8">
                       {uploadedFiles.length > 0 ? (
                         <>
                           <div className="flex items-center justify-between mb-8">
                             <h2 className="text-2xl font-bold tracking-tight">Recent Intelligence</h2>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="font-bold uppercase tracking-tighter text-xs"
                               onClick={() => setShowLibrary(true)}
                             >
                               View Library
                             </Button>
                           </div>
                           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                             {[...uploadedFiles].reverse().slice(0, 6).map((file, index) => (
                               <motion.div
                                 key={index}
                                 whileHover={{ y: -6, scale: 1.02 }}
                                 className={`glass-card p-6 rounded-3xl cursor-pointer group relative overflow-hidden border border-border ${index === 0 ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}
                                 onClick={() => {
                                   setCurrentFile(file);
                                   const ext = file.name.split('.').pop()?.toLowerCase();
                                   if (['xlsx', 'xls', 'csv', 'pdf'].includes(ext || '')) {
                                     setViewMode('analytics');
                                   } else if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json'].includes(ext || '')) {
                                     setViewMode('code');
                                   } else {
                                     setViewMode('text');
                                   }
                                 }}
                               >
                                 {index === 0 && (
                                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">LATEST</div>
                                 )}
                                 <div className="flex items-start gap-4">
                                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/20">
                                     <FileText className="h-7 w-7" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                     <p className="font-bold truncate text-base mb-1">{file.name}</p>
                                     <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-black uppercase tracking-widest opacity-60 border border-border">
                                           {file.name.split('.').pop()}
                                        </span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                          {new Date(file.uploadedAt).toLocaleDateString()}
                                        </span>
                                     </div>
                                   </div>
                                 </div>
                               </motion.div>
                             ))}
                           </div>
                         </>
                       ) : (
                         <div className="rounded-[2.5rem] p-12 text-center border-2 border-dashed border-border bg-card/50">
                            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center border border-border">
                               <UploadIcon className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Documents Ingested</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                               Start by uploading a dataset or document to begin your analysis session.
                            </p>
                            <Button onClick={() => setShowUpload(true)} variant="outline" className="rounded-xl font-bold border border-border">
                               Initialize First Upload
                            </Button>
                         </div>
                       )}
                    </div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                 </div>
              </div>
            </motion.div>
          )}

          {viewMode === "code" && fileContent && (
            <div className="h-full">
              <CodeViewer 
                content={fileContent} 
                fileName={currentFile?.name}
              />
            </div>
          )}

          {viewMode === "text" && fileContent && (
            <div className="h-full">
              <TextViewer 
                content={fileContent}
                fileName={currentFile?.name}
              />
            </div>
          )}

          {viewMode === "data" && fileContent && (
            <div className="h-full">
              <DataViewer 
                data={fileContent}
                fileName={currentFile?.name}
              />
            </div>
          )}

          {viewMode === "analytics" && (
            <div className="h-full flex gap-6 overflow-hidden">
              {/* Left Side: Full Analysis */}
              <motion.div 
                animate={{ 
                  width: isAIChatExpanded ? "0%" : "65%",
                  opacity: isAIChatExpanded ? 0 : 1,
                  x: isAIChatExpanded ? -50 : 0
                }}
                className="h-full overflow-auto pr-2 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analysis Overview</h1>
                    <p className="text-muted-foreground text-sm">
                      {currentFile?.name || "No file selected"}
                    </p>
                  </div>
                  <Button onClick={handleNewUpload} variant="outline" size="sm" className="gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Upload
                  </Button>
                </div>

                <StatsCards />
                
                {Array.isArray(fileContent) && fileContent.length > 0 && typeof fileContent[0] === 'object' ? (
                  <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="min-h-[300px]">
                      <RevenueChart />
                    </div>
                    <div className="min-h-[300px]">
                      <UserActivityChart />
                    </div>
                  </div>
                ) : currentFile?.type?.startsWith('image/') ? (
                  <div className="glass-card rounded-[2.5rem] p-6 text-center shadow-xl">
                    <img src={fileContent as string} alt="Document" className="mx-auto rounded-3xl max-h-[500px] object-contain shadow-inner" />
                  </div>
                ) : (
                  <div className="rounded-[2.5rem] p-8 max-h-[500px] overflow-auto custom-scrollbar shadow-none border border-border bg-card">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <FileText className="h-5 w-5" />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Extracted Document Text</h3>
                    </div>
                    {typeof fileContent === 'string' ? (
                      <div className="whitespace-pre-wrap text-sm text-foreground/80 font-sans leading-relaxed">
                        {fileContent || "Document loaded but no visible text could be parsed automatically. Neural Assistant can still answer questions about the file contents."}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Document loaded successfully. No visible text to render, but the Neural Assistant has full access to analyze the contents. Ask a question to begin.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Right Side: Small Chat / Full Analysis Expandable */}
              <motion.div 
                animate={{ 
                  width: isAIChatExpanded ? "100%" : "35%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full relative flex flex-col"
              >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => setIsAIChatExpanded(!isAIChatExpanded)}
                    className="shadow-lg backdrop-blur-md bg-white/20 hover:bg-white/30 h-8 w-8 rounded-full"
                    title={isAIChatExpanded ? "Exit Fullscreen" : "Expand Chat"}
                  >
                    {isAIChatExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className={`h-full flex flex-col ${isAIChatExpanded ? "p-0" : "p-0"}`}>
                   <AIInsights isExpanded={isAIChatExpanded} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <ReportsModal isOpen={showReports} onClose={() => setShowReports(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UploadModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
        onFileSelect={handleFileSelect}
      />
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
      <FilesLibraryModal 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)}
        onFileSelect={(file) => {
          setCurrentFile(file);
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (['xlsx', 'xls', 'csv', 'pdf'].includes(ext || '')) {
            setViewMode('analytics');
          } else if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json'].includes(ext || '')) {
            setViewMode('code');
          } else {
            setViewMode('text');
          }
          setShowLibrary(false);
        }}
      />
      <WelcomeTour 
        isOpen={showWelcomeTour} 
        onClose={() => setShowWelcomeTour(false)} 
      />
    </>
  );
}
