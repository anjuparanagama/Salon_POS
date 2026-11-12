import { Check, ShieldCheck, Store, User, CheckCircle2 } from "lucide-react";
import type { RegistrationStep } from "../../../interface/auth.types";

interface StepIndicatorProps {
  currentStep: RegistrationStep;
}

const steps = [
  { step: 1, label: "Owner Details", icon: User },
  { step: 2, label: "OTP Verification", icon: ShieldCheck },
  { step: 3, label: "Salon Details", icon: Store },
  { step: 4, label: "Complete", icon: CheckCircle2 },
] as const;

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-5">
      {/* Steps bar */}
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
        
        {/* Active progress track */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 ease-out -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map(({ step, label, icon: Icon }) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`flex size-10 sm:size-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary border-primary text-white shadow-xs"
                    : isCurrent
                    ? "bg-white border-primary text-primary shadow-md ring-4 ring-primary/15"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-5 stroke-[2.5]" />
                ) : (
                  <Icon className="size-5 stroke-[2]" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap hidden sm:block ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Current Step title for mobile */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs font-semibold text-primary">
          Step {currentStep} of 4: {steps[currentStep - 1].label}
        </span>
      </div>
    </div>
  );
}

export default StepIndicator;

