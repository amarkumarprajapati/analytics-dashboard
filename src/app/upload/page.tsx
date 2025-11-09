"use client";

import { useState } from "react";
import { FileUpload } from "@/components/upload/file-upload";
import { AnalyzingLoader } from "@/components/upload/analyzing-loader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UploadPage() {
  const router = useRouter();
  const { setCurrentFile, setIsAnalyzing, setAnalysisProgress } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setAnalyzing(true);
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentFile({
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date(),
            });
            setIsAnalyzing(false);
            router.push("/");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setAnalysisProgress(progress);
  };

  return (
    <>
      {analyzing && <AnalyzingLoader progress={progress} />}
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Upload Data File</h1>
          <p className="text-muted-foreground mt-2">
            Upload your Excel or PDF file to start analyzing your data
          </p>
        </motion.div>

        <div className="flex items-center justify-center min-h-[500px]">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-3 mt-12"
        >
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-2">Supported Formats</h3>
            <p className="text-sm text-muted-foreground">
              Excel (.xlsx, .xls) and PDF files up to 10MB
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-2">Fast Processing</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis completed in seconds
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and never shared
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
