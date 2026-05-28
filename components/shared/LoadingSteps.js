'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, Terminal, Cpu, Zap, Search, Layout, Palette } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const steps = [
  { id: 'brainstorm', label: "Analyzing Startup Idea...", icon: Search, duration: 1500 },
  { id: 'naming', label: "Generating Brand Names...", icon: Terminal, duration: 1500 },
  { id: 'personas', label: "Defining Target Personas...", icon: Cpu, duration: 1500 },
  { id: 'palette', label: "Curating Color Palette...", icon: Palette, duration: 1000 },
  { id: 'copy', label: "Writing Marketing Copy...", icon: Layout, duration: 1500 },
  { id: 'social', label: "Drafting Social Assets...", icon: Zap, duration: 1500 },
  { id: 'final', label: "Assembling Brand Kit...", icon: Sparkles, duration: 1500 }
];

export default function LoadingSteps({ isGenerating, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const TOTAL_DURATION = 10000; // 10 seconds

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      setIsDone(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 99);
      setProgress(newProgress);

      // Determine current step based on elapsed time
      let cumulativeTime = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeTime += steps[i].duration;
        if (elapsed < cumulativeTime) {
          setCurrentStep(i);
          break;
        }
        if (i === steps.length - 1) {
          setCurrentStep(steps.length - 1);
        }
      }

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(timerRef.current);
        setProgress(100);
        setIsDone(true);
        if (onComplete) onComplete();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating, onComplete]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-lg px-6 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-2 border border-border/50 mb-4 animate-bounce-slow">
            <Sparkles className="w-8 h-8 text-primary animate-multi-color-glow-text" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            AI is crafting your brand
          </h2>
          <p className="text-text-muted font-medium">
            Processing chunks of data in real-time...
          </p>
        </div>

        <div className="bg-surface-2/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isPast = index < currentStep;
              const isCurrent = index === currentStep;
              const Icon = step.icon;

              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isCurrent ? 'translate-x-2' : ''
                  } ${index > currentStep ? 'opacity-30' : 'opacity-100'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isPast ? 'bg-primary/20 text-primary' : 
                    isCurrent ? 'bg-white/10 text-white animate-pulse' : 
                    'bg-surface-3 text-text-muted'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${
                      isPast ? 'text-primary' : 
                      isCurrent ? 'text-white' : 
                      'text-text-muted'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <div className="h-0.5 bg-primary/20 mt-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-loading-bar" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-4 border-t border-border/30">
            <div className="flex justify-between text-[10px] font-mono tracking-widest text-text-muted uppercase">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-surface-3" />
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-text-muted text-xs font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          SYNCING WITH NEURAL ENGINE...
        </div>
      </div>
    </div>
  );
}
