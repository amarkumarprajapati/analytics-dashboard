"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataViewerProps {
  data: any;
  fileName?: string;
}

export function DataViewer({ data, fileName }: DataViewerProps) {
 
  const isTableData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';

  if (isTableData) {
    const headers = Object.keys(data[0]);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full rounded-lg border overflow-hidden flex flex-col"
      >
        <div className="bg-muted px-4 py-2 border-b flex-shrink-0">
          <p className="text-sm font-medium">Data Table - {fileName || "Untitled"}</p>
          <p className="text-xs text-muted-foreground">{data.length} rows × {headers.length} columns</p>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="text-left p-3 font-semibold border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => (
                <tr key={i} className="border-b hover:bg-muted/50">
                  {headers.map((header, j) => (
                    <td key={j} className="p-3">
                      {row[header]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full rounded-lg border overflow-hidden flex flex-col"
    >
      <div className="bg-muted px-4 py-2 border-b flex-shrink-0">
        <p className="text-sm font-medium">Data Viewer - {fileName || "Untitled"}</p>
      </div>
      <div className="flex-1 overflow-auto bg-background">
        <pre className="p-6 font-mono text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
}
