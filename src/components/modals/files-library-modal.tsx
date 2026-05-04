"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, FileSpreadsheet, FileCode, Trash2, Search, Calendar, HardDrive, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilesLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: any) => void;
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  const codeExts = ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json', 'xml', 'sql'];
  const dataExts = ['xlsx', 'xls', 'csv'];

  if (codeExts.includes(ext || '')) return <FileCode className="h-5 w-5 text-blue-500" />;
  if (dataExts.includes(ext || '')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

export function FilesLibraryModal({ isOpen, onClose, onFileSelect }: FilesLibraryModalProps) {
  const { uploadedFiles, removeFile } = useAppStore();
  const [search, setSearch] = useState("");
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const filteredFiles = uploadedFiles.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (index: number) => {
    setDeletingIndex(index);
    setTimeout(() => {
      removeFile(index);
      setDeletingIndex(null);
    }, 300);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Library">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5" />
            {uploadedFiles.length} files
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatSize(uploadedFiles.reduce((acc, f) => acc + (f.size || 0), 0))} total
          </span>
        </div>

        {/* File List */}
        <div className="space-y-2 max-h-[400px] overflow-auto custom-scrollbar">
          <AnimatePresence>
            {filteredFiles.length > 0 ? (
              [...filteredFiles].reverse().map((file, revIndex) => {
                const actualIndex = uploadedFiles.length - 1 - revIndex;
                return (
                  <motion.div
                    key={`${file.name}-${actualIndex}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: deletingIndex === actualIndex ? 0 : 1, y: 0, scale: deletingIndex === actualIndex ? 0.95 : 1 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-accent/50 transition-colors group"
                  >
                    <button
                      onClick={() => onFileSelect(file)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{formatSize(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                          {Array.isArray(file.data) && (
                            <>
                              <span>•</span>
                              <span>{file.data.length} rows</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(actualIndex);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {search ? "No files matching your search" : "No files uploaded yet"}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
