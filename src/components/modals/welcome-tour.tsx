"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Upload, BarChart3, FileText, Settings } from "lucide-react";

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeTour({ isOpen, onClose }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Analytics Hub!",
      description: "Let's take a quick tour to help you get started with analyzing your data.",
      icon: BarChart3,
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Upload Your Files",
      description: "Click the Upload button in the top bar to upload Excel, CSV, or PDF files for analysis.",
      icon: Upload,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "View Analytics",
      description: "Once uploaded, view detailed analytics, charts, and AI-powered insights about your data.",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Generate Reports",
      description: "Access the Reports section to generate and download comprehensive reports of your analysis.",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Customize Settings",
      description: "Adjust your preferences, theme, and other settings to personalize your experience.",
      icon: Settings,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("tourCompleted", "true");
    onClose();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="" hideHeader={true}>
      <div className="text-center space-y-6 py-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`h-20 w-20 rounded-full bg-linear-to-br ${currentStepData.color} flex items-center justify-center shadow-lg`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold">{currentStepData.title}</h3>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            {currentStepData.description}
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip Tour
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
