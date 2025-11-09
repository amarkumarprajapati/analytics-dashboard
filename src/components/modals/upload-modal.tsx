"use client";

import { Modal } from "@/components/ui/modal";
import { FileUpload } from "@/components/upload/file-upload";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export function UploadModal({ isOpen, onClose, onFileSelect }: UploadModalProps) {
  const handleFileSelect = (file: File) => {
    onFileSelect(file);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload File">
      <div className="py-4">
        <FileUpload onFileSelect={handleFileSelect} />
        
        {/* Info Section */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-muted/50 p-3">
            <h3 className="font-semibold mb-1 text-sm">Supported Formats</h3>
            <p className="text-xs text-muted-foreground">
              Excel (.xlsx, .xls) and PDF files up to 10MB
            </p>
          </div>
          <div className="rounded-xl border bg-muted/50 p-3">
            <h3 className="font-semibold mb-1 text-sm">Fast Processing</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered analysis completed in seconds
            </p>
          </div>
          <div className="rounded-xl border bg-muted/50 p-3">
            <h3 className="font-semibold mb-1 text-sm">Secure & Private</h3>
            <p className="text-xs text-muted-foreground">
              Your data is encrypted and never shared
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
