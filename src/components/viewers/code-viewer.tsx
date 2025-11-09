"use client";

import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useAppStore } from "@/store/useAppStore";

interface CodeViewerProps {
  content: string;
  language?: string;
  fileName?: string;
}

export function CodeViewer({ content, language = "javascript", fileName }: CodeViewerProps) {
  const theme = useAppStore((state) => state.theme);


  const detectLanguage = (name?: string) => {
    if (!name) return language;
    const ext = name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      tsx: "typescript",
      jsx: "javascript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      go: "go",
      rs: "rust",
      rb: "ruby",
      php: "php",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      sql: "sql",
      md: "markdown",
      sh: "shell",
    };
    return langMap[ext || ""] || "plaintext";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full rounded-lg border overflow-hidden"
    >
      <div className="bg-muted px-4 py-2 border-b">
        <p className="text-sm font-medium">Code Editor - {fileName || "Untitled"}</p>
      </div>
      <Editor
        height="calc(100% - 41px)"
        defaultLanguage={detectLanguage(fileName)}
        value={content}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </motion.div>
  );
}
