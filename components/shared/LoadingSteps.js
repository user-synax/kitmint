'use client';

import { useState, useEffect } from 'react';

const steps = [
  "Naming your brand...",
  "Defining target personas...",
  "Picking your colors...",
  "Designing logo concepts...",
  "Writing your copy...",
  "Drafting social bios...",
  "Crafting your launch story..."
];

export default function LoadingSteps({ isGenerating }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/95 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm px-6">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isPast = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <div 
                key={step}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isCurrent ? 'translate-x-2' : ''
                }`}
              >
                <span className={`text-lg font-medium transition-colors duration-300 ${
                  isPast ? 'text-[#4ADE80]' : 
                  isCurrent ? 'text-white' : 
                  'text-[#6B7280]'
                }`}>
                  {isPast ? '✓ ' : ''}{step}
                </span>
              </div>
            );
          })}
        </div>
        
        <p className="mt-12 text-center text-[#6B7280] text-sm animate-pulse">
          This takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
