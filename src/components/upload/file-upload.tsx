"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, FileText, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadClick?: () => void;
}

export function FileUpload({ onFileSelect, onUploadClick }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [showUpload, setShowUpload] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError("");

    if (rejectedFiles.length > 0) {
      setError("Please upload only .xlsx, .xls, or .pdf files");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError("");
  };

    const handleNewUpload = () => {
    setShowUpload(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        // onClick={onUploadClick}
         onClick={() => setShowUpload(true)}
      >
        <div
         onClick={() => setShowUpload(true)}
          {...getRootProps()}
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
            isDragActive
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
            selectedFile && "border-green-500/50 bg-green-500/5"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="p-12 text-center">
            <motion.div
              animate={{
                y: isDragActive ? -10 : 0,
                scale: isDragActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="flex justify-center mb-4"
            >
              {selectedFile ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <Upload className="h-16 w-16 text-primary" />
              )}
            </motion.div>

            <h3 className="text-xl font-semibold mb-2">
              {isDragActive
                ? "Drop your file here"
                : selectedFile
                ? "File ready to analyze"
                : "Upload your data file"}
            </h3>

            <p className="text-muted-foreground mb-4">
              {selectedFile
                ? "Click 'Analyze' to process your file"
                : "Drag and drop or click to browse"}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>.xlsx, .xls</span>
              <span>•</span>
              <FileText className="h-4 w-4" />
              <span>.pdf</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {selectedFile.type.includes('pdf') ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : (
                    <FileSpreadsheet className="h-10 w-10 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAnalyze} size="sm">
                  Analyze
                </Button>
                <Button
                  onClick={handleRemove}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
