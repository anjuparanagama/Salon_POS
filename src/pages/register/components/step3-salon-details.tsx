import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SalonDetailsFormData } from "../../../interface/auth.types";
import { authService } from "../../../services/auth.service";

interface Step3SalonDetailsProps {
  formData: SalonDetailsFormData;
  onChange: (fields: Partial<SalonDetailsFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage?: string;
}

const SALON_TYPES = [
  "Unisex Hair & Beauty Salon",
  "Women's Beauty & Hair Lounge",
  "Men's Barber & Grooming Studio",
  "Nails, Lash & Brow Bar",
  "Ayurvedic & Luxury Wellness Spa",
  "Bridal Dressing & Makeover Studio",
];

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
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [suggestedSlug, setSuggestedSlug] = useState<string>("");

  const handleSalonNameChange = (name: string) => {
    const rawSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    onChange({
      salonName: name,
      slug: rawSlug,
    });
    if (fieldErrors.salonName) setFieldErrors((prev) => ({ ...prev, salonName: "" }));
  };

  useEffect(() => {
    if (!formData.slug || formData.slug.length < 2) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        const res = await authService.checkSlug(formData.slug);
        if (res.available) {
          setSlugStatus("available");
          setSuggestedSlug("");
        } else {
          setSlugStatus("taken");
          setSuggestedSlug(res.slug);
        }
      } catch {
        setSlugStatus("available");
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [formData.slug]);

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
          Set up your salon location, category, and online booking domain
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Salon Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.salonName}
            onChange={(e) => handleSalonNameChange(e.target.value)}
            placeholder="e.g. Glamour Hair & Beauty Lounge"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              fieldErrors.salonName ? "border-red-400" : "border-slate-200"
            }`}
          />
          {fieldErrors.salonName && (
            <p className="mt-1 text-[11px] text-red-600">{fieldErrors.salonName}</p>
          )}
        </div>

        {/* Online Booking Subdomain */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Online Booking Domain <span className="text-red-500">*</span>
            </label>
            {slugStatus === "checking" && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Loader2 className="size-3 animate-spin" /> checking...
              </span>
            )}
            {slugStatus === "available" && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Available
              </span>
            )}
            {slugStatus === "taken" && (
              <span className="text-[11px] text-amber-600 font-medium">
                Taken. Suggested: {suggestedSlug}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                onChange({
                  slug: e.target.value.toLowerCase().replace(/[^\w-]/g, ""),
                })
              }
              placeholder="glamour-hair"
              disabled={isLoading}
              className="w-full rounded-l-lg bg-primary-subtle border border-r-0 border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 outline-none transition focus:bg-white focus:border-primary"
            />
            <span className="inline-flex items-center px-3 py-2.5 rounded-r-lg border border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold shrink-0">
              .salora.lk
            </span>
          </div>
        </div>

        {/* Salon Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={formData.salonType}
            onChange={(e) => onChange({ salonType: e.target.value })}
            disabled={isLoading}
            className="w-full rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {SALON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => {
              onChange({ address: e.target.value });
              if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: "" }));
            }}
            placeholder="e.g. 45 Galle Road, Bambalapitiya"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              fieldErrors.address ? "border-red-400" : "border-slate-200"
            }`}
          />
          {fieldErrors.address && (
            <p className="mt-1 text-[11px] text-red-600">{fieldErrors.address}</p>
          )}
        </div>

        {/* City & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              City / Town <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => {
                onChange({ city: e.target.value });
                if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: "" }));
              }}
              placeholder="Colombo 04"
              disabled={isLoading}
              className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                fieldErrors.city ? "border-red-400" : "border-slate-200"
              }`}
            />
            {fieldErrors.city && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.city}</p>
            )}
          </div>

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

        {/* Actions */}
        <div className="flex items-center gap-2.5 pt-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Salon...</span>
              </div>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step3SalonDetails;
