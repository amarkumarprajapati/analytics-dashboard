"use client";

import { Modal } from "@/components/ui/modal";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyReports = [
  { id: 1, name: "Monthly Sales Report", date: "Nov 5, 2025", type: "Excel" },
  { id: 2, name: "User Analytics Summary", date: "Nov 3, 2025", type: "PDF" },
  { id: 3, name: "Q3 Performance Data", date: "Oct 28, 2025", type: "Excel" },
];

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Reports">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Export your analyzed data and AI insights
        </p>

        <div className="space-y-2">
          {dummyReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {report.type === "Excel" ? (
                  <FileSpreadsheet className="h-5 w-5 text-green-500" />
                ) : (
                  <FileText className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full" variant="outline">
            Generate New Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
