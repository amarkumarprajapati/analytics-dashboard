"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Download, FileSpreadsheet, FileText, Check, Loader2, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  const { uploadedFiles, currentFile } = useAppStore();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{ name: string; data: any } | null>(null);

  const handleDownloadFile = async (fileIndex: number) => {
    const file = uploadedFiles[fileIndex];
    if (!file) return;

    setDownloadingId(fileIndex);

    // Simulate a small delay for UX
    await new Promise(r => setTimeout(r, 800));

    try {
      if (Array.isArray(file.data) && file.data.length > 0) {
        // Export as Excel
        const ws = XLSX.utils.json_to_sheet(file.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, `${file.name.replace(/\.[^/.]+$/, "")}_export.xlsx`);
      } else if (typeof file.data === "string") {
        // Export as text file
        const blob = new Blob([file.data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.[^/.]+$/, "")}_export.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Export as JSON
        const blob = new Blob([JSON.stringify(file.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.[^/.]+$/, "")}_export.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setDownloadedIds(prev => new Set(prev).add(fileIndex));
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);

    // Simulate generation delay
    await new Promise(r => setTimeout(r, 1500));

    // Generate a summary report from all uploaded files
    const reportData: any[] = uploadedFiles.map((file, i) => ({
      "#": i + 1,
      "File Name": file.name,
      "File Size (KB)": (file.size / 1024).toFixed(2),
      "Type": file.type || file.name.split('.').pop()?.toUpperCase(),
      "Uploaded": new Date(file.uploadedAt).toLocaleDateString(),
      "Records": Array.isArray(file.data) ? file.data.length : "N/A",
      "Columns": Array.isArray(file.data) && file.data.length > 0 ? Object.keys(file.data[0]).length : "N/A",
    }));

    // Add summary row
    const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    const totalRecords = uploadedFiles.reduce((acc, f) => acc + (Array.isArray(f.data) ? f.data.length : 0), 0);
    
    reportData.push({
      "#": "",
      "File Name": "TOTAL",
      "File Size (KB)": (totalSize / 1024).toFixed(2),
      "Type": "",
      "Uploaded": "",
      "Records": totalRecords,
      "Columns": "",
    });

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary Report");

    // If current file has data, add it as a second sheet
    if (currentFile && Array.isArray(currentFile.data) && currentFile.data.length > 0) {
      const dataSheet = XLSX.utils.json_to_sheet(currentFile.data);
      XLSX.utils.book_append_sheet(wb, dataSheet, "Current File Data");
    }

    const fileName = `Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setGeneratedReport({ name: fileName, data: reportData });
    setGenerating(false);
  };

  const recentFiles = [...uploadedFiles].reverse().slice(0, 10);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reports & Exports">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Export your analyzed data and generate comprehensive reports
        </p>

        {recentFiles.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Files</h3>
            {recentFiles.map((file, index) => {
              const actualIndex = uploadedFiles.length - 1 - index;
              const isDownloading = downloadingId === actualIndex;
              const isDownloaded = downloadedIds.has(actualIndex);
              const isData = Array.isArray(file.data);

              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isData ? (
                      <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={isDownloaded ? "ghost" : "outline"} 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDownloadFile(actualIndex)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</>
                    ) : isDownloaded ? (
                      <><Check className="h-4 w-4 text-emerald-500" /> Downloaded</>
                    ) : (
                      <><Download className="h-4 w-4" /> Export</>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl border border-dashed">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload files to export and generate reports</p>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          <AnimatePresence>
            {generatedReport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
              >
                <Check className="h-4 w-4" />
                <span className="font-medium">{generatedReport.name}</span> downloaded!
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            className="w-full gap-2" 
            variant="outline"
            onClick={handleGenerateReport}
            disabled={generating || uploadedFiles.length === 0}
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating Report...</>
            ) : (
              <><BarChart3 className="h-4 w-4" /> Generate Summary Report</>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Generates an Excel report summarizing all your uploaded files and their statistics
          </p>
        </div>
      </div>
    </Modal>
  );
}
