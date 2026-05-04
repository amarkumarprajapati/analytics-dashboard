"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, FileText, FileCode, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadClick?: () => void;
}

const ACCEPTED_EXTENSIONS: Record<string, string[]> = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt', '.log', '.md'],
  'application/json': ['.json'],
  'text/javascript': ['.js', '.jsx'],
  'text/typescript': ['.ts', '.tsx'],
  'text/x-python': ['.py'],
  'text/html': ['.html'],
  'text/css': ['.css'],
  'text/x-java-source': ['.java'],
  'text/x-c': ['.c', '.cpp', '.h'],
  'text/x-csharp': ['.cs'],
  'text/x-go': ['.go'],
  'text/x-rustsrc': ['.rs'],
  'text/x-ruby': ['.rb'],
  'application/x-httpd-php': ['.php'],
  'application/xml': ['.xml'],
  'application/sql': ['.sql'],
};

const getFileIcon = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const codeExts = ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json', 'xml', 'sql'];
  const dataExts = ['xlsx', 'xls', 'csv'];
  
  if (codeExts.includes(ext || '')) return <FileCode className="h-10 w-10 text-blue-500" />;
  if (dataExts.includes(ext || '')) return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
  if (ext === 'pdf') return <FileText className="h-10 w-10 text-red-500" />;
  return <FileText className="h-10 w-10 text-muted-foreground" />;
};

export function FileUpload({ onFileSelect, onUploadClick }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError("");

    if (rejectedFiles.length > 0) {
      setError("Unsupported file type. Try xlsx, csv, pdf, txt, json, or code files.");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 50 * 1024 * 1024) {
        setError("File is too large. Maximum size is 50MB.");
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_EXTENSIONS,
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
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

            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5" /> xlsx, csv</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> pdf, txt</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FileCode className="h-3.5 w-3.5" /> js, py, json +more</span>
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
                  {getFileIcon(selectedFile)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop()?.toUpperCase()}
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
