import { useState, useRef, useEffect } from "react";
import { Loader2, ArrowLeft, AlertCircle, RefreshCw, Sparkles, Mail, Phone } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";

interface Step2OtpVerificationProps {
  maskedEmail: string;
  maskedPhone: string;
  devOtp?: string;
  isLoading: boolean;
  errorMessage?: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  cooldownSeconds: number;
}

export function Step2OtpVerification({
  maskedEmail,
  maskedPhone,
  devOtp,
  isLoading,
  errorMessage,
  onVerify,
  onResend,
  onBack,
  cooldownSeconds,
}: Step2OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(cooldownSeconds || 60);

  useEffect(() => {
    setTimer(cooldownSeconds || 60);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned[cleaned.length - 1];
    setDigits(newDigits);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const fullOtp = digits.join("");
  const isComplete = fullOtp.length === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onVerify(fullOtp);
    }
  };

  const handleAutofillDevOtp = () => {
    if (!devOtp) return;
    const otpArray = devOtp.split("").slice(0, 6);
    setDigits(otpArray);
    inputRefs.current[5]?.focus();
  };

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary-deep tracking-tight">
          OTP Verification
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Enter the 6-digit code sent to verify your identity
        </p>
      </div>

      {/* Masked destination info badge */}
      <div className="mb-4 rounded-lg border border-slate-200 bg-primary-subtle p-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Mail className="size-3.5 text-primary shrink-0" />
          <span>Email: <strong className="text-slate-900">{maskedEmail || "your email"}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="size-3.5 text-primary shrink-0" />
          <span>Phone: <strong className="text-slate-900">{maskedPhone || "your phone"}</strong></span>
        </div>
      </div>

      {/* Dev OTP Helper Banner */}
      {devOtp && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-pink-200 bg-pink-50/90 px-3 py-2 text-xs text-pink-900">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary shrink-0" />
            <span>
              Code: <strong className="font-mono text-xs tracking-wider text-primary">{devOtp}</strong>
            </span>
          </div>
          <Button
            type="button"
            onClick={handleAutofillDevOtp}
            className="rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white transition cursor-pointer"
          >
            Auto-fill
          </Button>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 6 Digit Inputs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2.5 text-center">
            Verification Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <Input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                wrapperClassName="w-auto"
                className={`size-11 sm:size-12 rounded-lg border text-center text-lg font-bold font-mono transition-all outline-none p-0 ${
                  digit
                    ? "border-primary bg-primary-subtle text-primary ring-2 ring-primary/20"
                    : "border-slate-200 bg-primary-subtle text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resend Action & Countdown */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <Button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Edit details</span>
          </Button>

          {timer > 0 ? (
            <span className="text-slate-400 font-medium">
              Resend in <strong className="text-slate-700 font-mono">{timer}s</strong>
            </span>
          ) : (
            <Button
              type="button"
              onClick={onResend}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-dark transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="size-3.5" />
              <span>Resend Code</span>
            </Button>
          )}
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          disabled={!isComplete || isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <span>Verify & Continue</span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default Step2OtpVerification;
