import { useState } from "react";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import type { SalonDetailsFormData } from "../../../interface/auth.types";

interface Step3SalonDetailsProps {
  formData: SalonDetailsFormData;
  onChange: (fields: Partial<SalonDetailsFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage?: string;
}

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
  "Jaffna",
];

export function Step3SalonDetails({
  formData,
  onChange,
  onSubmit,
  onBack,
  isLoading,
  errorMessage,
}: Step3SalonDetailsProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSalonNameChange = (name: string) => {
    onChange({ salonName: name });
    if (fieldErrors.salonName) setFieldErrors((prev) => ({ ...prev, salonName: "" }));
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.salonName.trim() || formData.salonName.trim().length < 2) {
      errors.salonName = "Please enter your salon name.";
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter the salon's street address.";
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter your city/town.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary-deep tracking-tight">
          Salon Details
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Set up your salon location and basic details
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={validateAndSubmit} className="space-y-3.5">
        {/* Salon Name */}
        <Input
          type="text"
          label={<>Salon Name <span className="text-red-500">*</span></>}
          labelClassName="block text-xs font-semibold text-slate-700"
          value={formData.salonName}
          onChange={(e) => handleSalonNameChange(e.target.value)}
          placeholder="e.g. Glamour Hair & Beauty Lounge"
          disabled={isLoading}
          error={fieldErrors.salonName}
          className="rounded-lg bg-primary-subtle border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-primary/20"
        />

        {/* Street Address */}
        <Input
          type="text"
          label={<>Street Address <span className="text-red-500">*</span></>}
          labelClassName="block text-xs font-semibold text-slate-700"
          value={formData.address}
          onChange={(e) => {
            onChange({ address: e.target.value });
            if (fieldErrors.address) setFieldErrors((p) => ({ ...p, address: "" }));
          }}
          placeholder="e.g. 45 Galle Road, Bambalapitiya"
          disabled={isLoading}
          error={fieldErrors.address}
          className="rounded-lg bg-primary-subtle border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-primary/20"
        />

        {/* City & District Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="text"
            label={<>City / Town <span className="text-red-500">*</span></>}
            labelClassName="block text-xs font-semibold text-slate-700"
            value={formData.city}
            onChange={(e) => {
              onChange({ city: e.target.value });
              if (fieldErrors.city) setFieldErrors((p) => ({ ...p, city: "" }));
            }}
            placeholder="Colombo"
            disabled={isLoading}
            error={fieldErrors.city}
            className="rounded-lg bg-primary-subtle border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-primary/20"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              District
            </label>
            <select
              value={formData.district}
              onChange={(e) => onChange({ district: e.target.value })}
              disabled={isLoading}
              className="w-full rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Salon Hotline & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Input
            type="tel"
            label={<>Salon Phone <span className="text-slate-400 font-normal">(optional)</span></>}
            labelClassName="block text-xs font-semibold text-slate-700"
            value={formData.salonPhone}
            onChange={(e) => onChange({ salonPhone: e.target.value })}
            placeholder="e.g. +94 11 234 5678"
            disabled={isLoading}
            className="rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <Input
            type="email"
            label={<>Salon Email <span className="text-slate-400 font-normal">(optional)</span></>}
            labelClassName="block text-xs font-semibold text-slate-700"
            value={formData.salonEmail}
            onChange={(e) => onChange({ salonEmail: e.target.value })}
            placeholder="e.g. info@glamoursalon.lk"
            disabled={isLoading}
            className="rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-3">
          <Button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Salon Workspace...</span>
              </>
            ) : (
              <span>Complete Registration</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Step3SalonDetails;
