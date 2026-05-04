"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Send, User, Bot, Loader2, Sparkles, Key, AlertCircle, Maximize2, Minimize2, Terminal, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCards } from "./stats-cards";
import { RevenueChart } from "./revenue-chart";
import { UserActivityChart } from "./user-activity-chart";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Format markdown-like AI responses into styled JSX
function formatMessage(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let codeIndex = 0;

  lines.forEach((line, i) => {
    // Code block start/end
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${codeIndex++}`} className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl p-4 my-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
            <code>{codeContent.trim()}</code>
          </pre>
        );
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      return;
    }

    // Empty lines = spacer
    if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      return;
    }

    // Headings (### or ## or #)
    if (line.trim().startsWith('### ') || line.trim().startsWith('## ') || line.trim().startsWith('# ')) {
      const heading = line.replace(/^#+\s*/, '');
      elements.push(
        <p key={i} className="font-bold text-sky-600 dark:text-sky-400 mt-2 mb-1 text-sm">{renderInline(heading)}</p>
      );
      return;
    }

    // Bullet points (- or * or •)
    if (/^\s*[-*•]\s+/.test(line)) {
      const content = line.replace(/^\s*[-*•]\s+/, '');
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-1 my-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-[7px] shrink-0" />
          <span className="text-sm leading-relaxed">{renderInline(content)}</span>
        </div>
      );
      return;
    }

    // Numbered lists (1. 2. etc)
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const num = line.match(/^\s*(\d+)[.)]/)?.[1];
      const content = line.replace(/^\s*\d+[.)]\s+/, '');
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-1 my-0.5">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-900/30 h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{num}</span>
          <span className="text-sm leading-relaxed">{renderInline(content)}</span>
        </div>
      );
      return;
    }

    // Regular paragraph
    elements.push(<p key={i} className="text-sm leading-relaxed my-0.5">{renderInline(line)}</p>);
  });

  return <>{elements}</>;
}

// Render inline markdown (bold, italic, inline code)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold text-foreground">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index} className="italic">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(<code key={match.index} className="bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-md text-xs font-mono">{match[4]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

export function AIInsights({ isExpanded }: { isExpanded?: boolean }) {
  const { currentFile, geminiApiKey } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialSummary = async () => {
      if (!currentFile || !geminiApiKey) return;
      
      setMessages([
        {
          role: "bot",
          content: `Systems online. I've successfully ingested **${currentFile.name}**. Initializing deep analysis...`,
          timestamp: new Date(),
        },
      ]);
      setLoading(true);

      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        let dataString = "";
        if (typeof currentFile.data === 'string') {
          dataString = currentFile.data.slice(0, 100000);
        } else if (currentFile.data) {
          dataString = JSON.stringify(currentFile.data).slice(0, 100000);
        }

        const systemPrompt = `You are an expert Data Analyst and Assistant.
The user has uploaded a file named "${currentFile.name}" (${currentFile.type}).
Here is the parsed data or a large sample of the file contents:
${dataString}

Provide a concise, 2-3 sentence high-level summary of what this document contains. Give the user an idea of what insights they might find. Use markdown formatting with **bold** for key terms and bullet points for main findings.`;

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        let responseText = "";
        let success = false;

        for (const modelName of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ 
              model: modelName,
              systemInstruction: systemPrompt
            });
            const chat = model.startChat();
            const response = await chat.sendMessage("Please provide the initial summary of this document.");
            responseText = response.response.text();
            success = true;
            break;
          } catch (err: any) {
            if (err?.message?.includes("503") || err?.message?.includes("404")) continue;
            throw err;
          }
        }

        if (success && isMounted) {
          setMessages((prev) => [
            ...prev.filter(m => !m.content.includes("Initializing deep analysis")),
            {
              role: "bot",
              content: `**Initial Analysis Complete:**\n\n${responseText}\n\nWhat specific metrics or trends would you like me to dive into?`,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error: any) {
        console.warn("Auto-analysis skipped/failed", error.message);
        if (isMounted) {
          const isRateLimit = error?.message?.includes("429") || error?.message?.includes("quota");
          setMessages([
             {
               role: "bot",
               content: isRateLimit 
                 ? `Systems online. I've successfully ingested **${currentFile.name}**. However, you have temporarily exceeded your Gemini API free-tier quota (429 Rate Limit). Please wait a few seconds before asking questions.`
                 : `Systems online. I've successfully ingested **${currentFile.name}**. I'm ready to answer your questions.`,
               timestamp: new Date(),
             }
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentFile && messages.length === 0) {
       fetchInitialSummary();
    }

    return () => { isMounted = false; };
  }, [currentFile]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    setLoading(true);
    try {
      const activeKey = geminiApiKey;
      const genAI = new GoogleGenerativeAI(activeKey!);
      
      const chatHistory = messages
        .map(m => ({
          role: m.role === "user" ? "user" : "model" as "user" | "model",
          parts: [{ text: m.content }],
        }));

      const firstUserIndex = chatHistory.findIndex(m => m.role === "user");
      const validHistory = firstUserIndex !== -1 ? chatHistory.slice(firstUserIndex) : [];

      let dataString = "";
      if (typeof currentFile?.data === 'string') {
        dataString = currentFile.data.slice(0, 100000);
      } else if (currentFile?.data) {
        dataString = JSON.stringify(currentFile.data).slice(0, 100000);
      }

      const systemPrompt = `You are an expert Data Analyst and Assistant.
The user has uploaded a file named "${currentFile?.name}" (${currentFile?.type}).
Here is the parsed data or a large sample of the file contents:
${dataString}

Use this data to answer the user's questions accurately. If it's a dataset, provide numerical insights, trends, and summaries when asked. Format your response with markdown: use **bold** for key terms, bullet points for lists, and numbered steps for instructions.`;

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
      let responseText = "";
      let success = false;
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemPrompt
          });
          const chat = model.startChat({ history: validHistory });
          const response = await chat.sendMessage(userMessage);
          responseText = response.response.text();
          success = true;
          break;
        } catch (err: any) {
          lastError = err;
          if (err?.message?.includes("503") || err?.message?.includes("404")) {
             console.warn(`Model ${modelName} failed, falling back...`);
             continue;
          } else {
             throw err;
          }
        }
      }

      if (!success) {
        throw lastError || new Error("All available models failed.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: responseText, timestamp: new Date() },
      ]);
    } catch (err: any) {
      const isRateLimit = err?.message?.includes("429") || err?.message?.includes("quota");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: isRateLimit ? "⚠️ **Rate Limit Exceeded (429):** You have exceeded your free tier quota for the Gemini API. Please wait a moment and try again." : `System Alert: ${err.message || "Unknown error encountered during processing."}`, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const safeTimestamp = (ts: Date | string) => {
    const d = ts instanceof Date ? ts : new Date(ts);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="glass-card border-none overflow-hidden flex flex-col h-full relative group shadow-none">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <CardHeader className="border-b border-primary/10 bg-background/50 backdrop-blur-md py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-2xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight gradient-text">Neural Assistant</CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <CardDescription className="text-xs font-medium uppercase tracking-wider opacity-70">
                  Analyzing: {currentFile?.name || "Ready"}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-8 px-3 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-tighter">
                <Terminal className="h-3 w-3" />
                Gemini Flash
             </div>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 flex flex-col relative bg-background min-h-0">
          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar min-h-0" 
            ref={scrollRef}
          >
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col mb-8 p-6 rounded-3xl bg-muted/20 border border-border"
              >
                <div className="flex items-center gap-2 text-primary mb-4">
                  <LineChart className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Global Insights</span>
                </div>
                <div className="grid gap-8">
                  <StatsCards />
                  {Array.isArray(currentFile?.data) && currentFile.data.length > 0 && typeof currentFile.data[0] === 'object' ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                      <RevenueChart />
                      <UserActivityChart />
                    </div>
                  ) : (
                    <div className="rounded-2xl p-8 border-2 border-dashed border-border bg-muted/30">
                       <h4 className="text-lg font-bold text-primary mb-4">Document Overview</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                         <li className="flex items-start gap-2">
                           <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-primary" /></div>
                           <span>The uploaded document has been fully indexed by the neural engine.</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-primary" /></div>
                           <span>Natural language processing is active. You can ask for summaries, key points, or specific questions.</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-primary" /></div>
                           <span>For deeper insights, try asking the assistant to extract specific bullet points or action items.</span>
                         </li>
                       </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-border ${
                      message.role === "user"
                        ? "bg-primary text-white border-primary/20"
                        : "bg-secondary text-primary"
                    }`}>
                      {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className="relative group/msg">
                      <div className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed border transition-all duration-300 ${
                        message.role === "user"
                          ? "bg-primary text-white border-primary/20 rounded-tr-none"
                          : "bg-secondary text-foreground border-border rounded-tl-none"
                      }`}>
                        {message.role === "bot" ? formatMessage(message.content) : message.content}
                      </div>
                      <span className={`text-[10px] mt-1.5 font-medium opacity-40 block ${message.role === "user" ? "text-right" : "text-left"}`}>
                        {safeTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-4 max-w-[85%] items-center">
                  <div className="h-10 w-10 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="h-2 w-2 rounded-full bg-primary/40"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <div className="p-6 border-t border-border bg-background/80 backdrop-blur-xl">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md group-focus-within:bg-primary/10 transition-all" />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for an insight, summary, or deep-dive..."
                  className="relative bg-background border-border h-14 rounded-2xl px-6 focus-visible:ring-primary focus-visible:border-primary transition-all pr-16 shadow-none text-foreground"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2.5 top-2.5 h-9 w-9 rounded-xl shadow-xl hover:scale-110 active:scale-90 transition-all bg-gradient-to-br from-primary to-cyan-600 text-white"
                  disabled={!input.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}
