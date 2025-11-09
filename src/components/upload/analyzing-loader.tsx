"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, FileSearch, Brain, ChartBar, CheckCircle2 } from "lucide-react";

interface AnalyzingLoaderProps {
  progress: number;
}

const loadingSteps = [
  { icon: FileSearch, text: "Extracting insights...", threshold: 25 },
  { icon: Brain, text: "Processing with AI...", threshold: 50 },
  { icon: ChartBar, text: "Generating visual summary...", threshold: 75 },
  { icon: CheckCircle2, text: "Almost done...", threshold: 95 },
];

export function AnalyzingLoader({ progress }: AnalyzingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const step = loadingSteps.findIndex(
      (s, i) => progress < s.threshold || i === loadingSteps.length - 1
    );
    setCurrentStep(step);
  }, [progress]);

  const CurrentIcon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border bg-card p-8 shadow-2xl">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative"
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <CurrentIcon className="h-10 w-10 text-primary" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Analyzing Your Data
          </h2>

          {/* Current Step */}
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-muted-foreground mb-6"
          >
            {loadingSteps[currentStep].text}
          </motion.p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {progress}% Complete
            </p>
          </div>

          {/* Loading Steps Indicators */}
          <div className="flex justify-between mt-6">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isComplete = progress >= step.threshold;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
