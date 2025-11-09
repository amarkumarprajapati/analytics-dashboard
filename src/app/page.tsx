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
import { LoginModal } from "@/components/modals/login-modal";
import { ReportsModal } from "@/components/modals/reports-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { UploadModal } from "@/components/modals/upload-modal";
import { WelcomeTour } from "@/components/modals/welcome-tour";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { FileText, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "upload" | "data" | "code" | "text" | "analytics";

export default function Home() {
  const { currentFile, setCurrentFile, setIsAnalyzing } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>("upload");
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileContent, setFileContent] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const handleFileSelect = useCallback(async (file: File) => {
    setAnalyzing(true);
    setIsAnalyzing(true);
    setProgress(0);

  
    const reader = new FileReader();
    
    reader.onload = () => {
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
              };
              
              setCurrentFile(fileData);
              setIsAnalyzing(false);
              setAnalyzing(false);

            
              const ext = file.name.split('.').pop()?.toLowerCase();
              const codeExts = ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json'];
              const dataExts = ['xlsx', 'xls', 'csv'];
              const pdfExts = ['pdf'];

              if (codeExts.includes(ext || '')) {
                setViewMode('code');
                setFileContent(reader.result as string);
              } else if (dataExts.includes(ext || '')) {
                setViewMode('analytics');
             
                setFileContent(generateDummyData());
              } else if (pdfExts.includes(ext || '')) {
                setViewMode('analytics');
                setFileContent(null);
              } else {
                setViewMode('text');
                setFileContent(reader.result as string);
              }
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    };

    reader.readAsText(file);
  }, [setCurrentFile, setIsAnalyzing]);

  const generateDummyData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      ID: i + 1,
      Product: `Product ${i + 1}`,
      Sales: Math.floor(Math.random() * 1000) + 100,
      Revenue: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
      Status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Completed',
    }));
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
          onLoginClick={() => setShowLogin(true)}
          onBackClick={handleBackToUpload}
          showBackButton={viewMode !== "upload" && currentFile !== null}
        />

        <div className="flex-1 overflow-hidden p-6">
          {viewMode === "upload" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome to Analytics Hub</h1>
                <p className="text-muted-foreground max-w-md">
                  Upload your files to analyze data, view code, or read documents
                </p>
                <button 
                  onClick={() => setShowUpload(true)}
                  className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Analytics Hub v1.0.0 • Built with Next.js & TypeScript
                </button>
              </div>
              <FileUpload onFileSelect={handleFileSelect} />
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
            <div className="h-full overflow-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">
                      {currentFile?.name || "No file selected"}
                    </p>
                  </div>
                  <Button onClick={handleNewUpload} variant="outline" className="gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Upload New File
                  </Button>
                </div>

                <StatsCards />
                <AIInsights />

                <div className="grid gap-6 lg:grid-cols-2">
                  <RevenueChart />
                  <UserActivityChart />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <ReportsModal isOpen={showReports} onClose={() => setShowReports(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UploadModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
        onFileSelect={handleFileSelect}
      />
      {/* <WelcomeTour 
        isOpen={showWelcomeTour} 
        onClose={() => setShowWelcomeTour(false)} 
      /> */}
    </>
  );
}
