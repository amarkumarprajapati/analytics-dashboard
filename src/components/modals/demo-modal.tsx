import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MousePointer2, Upload, LineChart, Brain, User, Bot, Send } from "lucide-react";

export function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const sequence = async () => {
      // Step 0: Initial state, cursor moves to upload
      setStep(0);
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 1: Clicking upload, simulating analyzing loader
      setStep(1);
      await new Promise(r => setTimeout(r, 2500));
      
      // Step 2: Dashboard loaded, charts visible
      setStep(2);
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 3: Cursor moves to chat input
      setStep(3);
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 4: Typing message
      setStep(4);
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 5: Sending message
      setStep(5);
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 6: AI responding
      setStep(6);
      await new Promise(r => setTimeout(r, 4000));
      
      // Loop back to start
      setStep(0);
    };

    let mounted = true;
    const runSequence = async () => {
      while (mounted && isOpen) {
        await sequence();
      }
    };
    runSequence();

    return () => { mounted = false; };
  }, [isOpen]);

  // Define mouse positions for each step
  const getMousePos = (s: number) => {
    switch (s) {
      case 0: return { x: "20%", y: "80%" }; // Bottom left
      case 1: return { x: "50%", y: "40%" }; // Center (upload area)
      case 2: return { x: "30%", y: "20%" }; // Top left (dashboard title)
      case 3: return { x: "85%", y: "90%" }; // Bottom right (chat input)
      case 4: return { x: "85%", y: "90%" }; // Typing...
      case 5: return { x: "94%", y: "90%" }; // Send button
      case 6: return { x: "50%", y: "60%" }; // Center (watching response)
      default: return { x: "50%", y: "50%" };
    }
  };

  const mousePos = getMousePos(step);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/80 backdrop-blur-[2px] p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden bg-white dark:bg-black rounded-[2.5rem] border border-border shadow-none"
          >
        <div className="absolute top-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-background/80 backdrop-blur-md px-5 py-2 rounded-full border border-border flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">Automated Product Experience</span>
          </div>
        </div>

        {/* The "Screen" */}
        <div className="relative w-full h-full bg-background flex flex-col overflow-hidden pointer-events-none scale-[0.98] origin-center mt-4 rounded-[2rem] border border-border shadow-2xl">
          <AnimatePresence mode="wait">
            {(step === 0 || step === 1) && (
              <motion.div key="upload" className="flex-1 flex flex-col items-center justify-center p-8 bg-background" exit={{ opacity: 0 }}>
                <div className="h-16 w-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-6 border border-sky-400/20">
                  <FileText className="text-white h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-4">Upload Dataset</h2>
                <div className="h-12 w-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                  <Upload className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground font-bold">Q3_Report.xlsx</span>
                </div>
                {step === 1 && (
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="w-64 h-2 bg-sky-500 rounded-full mt-6" />
                )}
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex gap-4 p-6 bg-muted/20">
                {/* Left Side: Analytics */}
                <div className="w-2/3 flex flex-col gap-4">
                  <div className="h-12 bg-background rounded-xl border border-border flex items-center px-4">
                    <LineChart className="h-5 w-5 text-sky-600 mr-2" />
                    <span className="font-bold text-foreground">Analysis Overview</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-24 flex-1 bg-background rounded-xl border border-border p-4">
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-8 w-16 bg-sky-100 dark:bg-sky-900/30 rounded" />
                    </div>
                    <div className="h-24 flex-1 bg-background rounded-xl border border-border p-4">
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-8 w-16 bg-blue-100 dark:bg-blue-900/30 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 bg-background rounded-xl border border-border p-6 flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.2 + i * 0.1 }} className="flex-1 bg-sky-500/20 rounded-t-sm border-x border-sky-500/10" />
                    ))}
                  </div>
                </div>

                {/* Right Side: Chat */}
                <div className="w-1/3 bg-background rounded-xl border border-border flex flex-col overflow-hidden">
                  <div className="h-16 border-b border-border flex items-center px-4 bg-muted/10">
                    <Brain className="h-5 w-5 text-sky-600 mr-2" />
                    <span className="font-bold text-foreground">Neural Assistant</span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border"><Bot className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="bg-muted/50 border border-border p-3 rounded-2xl rounded-tl-none text-xs text-foreground">
                        I've analyzed Q3_Report.xlsx. What would you like to know?
                      </div>
                    </div>

                    {step >= 5 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 flex-row-reverse">
                        <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center shrink-0 border border-sky-500/20"><User className="h-4 w-4 text-white" /></div>
                        <div className="bg-sky-600 p-3 rounded-2xl rounded-tr-none text-xs text-white">
                          Summarize the key revenue drivers.
                        </div>
                      </motion.div>
                    )}

                    {step >= 6 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-3">
                        <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border"><Bot className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="bg-muted/50 border border-border p-3 rounded-2xl rounded-tl-none text-xs text-foreground">
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
                            Based on the data, the main driver was Enterprise Subscriptions, which grew by 35%...
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="h-14 border-t border-border p-2">
                    <div className="h-full bg-muted/50 rounded-lg border border-border flex items-center px-3 relative">
                      <span className="text-xs text-muted-foreground">
                        {step === 3 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-[2px] h-4 bg-muted-foreground inline-block animate-pulse" />}
                        {step === 4 && <motion.span initial={{ width: 0 }} animate={{ width: "100%" }} className="overflow-hidden whitespace-nowrap block">Summarize the key revenue drivers.</motion.span>}
                        {step > 4 && "Summarize the key revenue drivers."}
                      </span>
                      <div className="absolute right-2 h-6 w-6 bg-sky-600 rounded flex items-center justify-center border border-sky-500/20"><Send className="h-3 w-3 text-white" /></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fake Mouse Cursor */}
          <motion.div
            className="absolute z-50 pointer-events-none"
            initial={{ left: "20%", top: "80%" }}
            animate={{
              left: mousePos.x,
              top: mousePos.y,
              scale: step === 1 || step === 5 ? 0.9 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <MousePointer2 className="h-6 w-6 text-foreground fill-background stroke-foreground stroke-1 drop-shadow-md" />
          </motion.div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
