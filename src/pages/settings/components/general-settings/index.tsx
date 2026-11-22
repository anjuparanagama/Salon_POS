import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  RotateCcw,
  Save,
  Languages,
  Clock,
  Calendar,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
} from "lucide-react";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import type {
  GeneralSettingsState,
  BusinessHourItem,
} from "../../../../interface/settings.types";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../../../../interface/i18n.types";
import {
  settingsService,
  DEFAULT_GENERAL_SETTINGS,
} from "../../../../services/settings.service";
import { API_BASE_URL } from "../../../../config/api.config";
import { FormSkeleton } from "@/components/skeleton";
import { useConfirmationModal } from "../../../../components/confirmation-modal";

export type GeneralTabType = "profile" | "financial" | "operations";

export interface GeneralSettingsViewProps {
  activeTab?: GeneralTabType;
  onTabChange?: (tab: GeneralTabType) => void;
}

export function GeneralSettingsView({
  activeTab: controlledTab,
}: GeneralSettingsViewProps = {}) {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.split("-")[0] ||
    "en") as SupportedLanguage;

  const [internalTab] = useState<GeneralTabType>("profile");
  const activeTab = controlledTab ?? internalTab;

  const [formData, setFormData] = useState<GeneralSettingsState>(
    DEFAULT_GENERAL_SETTINGS,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  const { confirm, ConfirmationDialog } = useConfirmationModal();

  const displayLogoUrl = formData.logoUrl
    ? formData.logoUrl.startsWith("http://") ||
      formData.logoUrl.startsWith("https://") ||
      formData.logoUrl.startsWith("blob:") ||
      formData.logoUrl.startsWith("data:")
      ? formData.logoUrl
      : API_BASE_URL
        ? `${API_BASE_URL}${formData.logoUrl}`
        : formData.logoUrl
    : null;

  const handleLogoFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setLogoUploadError(
        "Please upload a valid image (PNG, JPG, WEBP, or SVG).",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError("Image file size must be less than 5MB.");
      return;
    }

    setLogoUploadError(null);
    setIsUploadingLogo(true);

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, logoUrl: previewUrl }));

    try {
      const uploadedUrl = await settingsService.uploadSalonLogo(file);
      setFormData((prev) => ({ ...prev, logoUrl: uploadedUrl }));
    } catch (err: any) {
      console.error("Logo upload error:", err);
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Could not upload to server immediately. Logo is cached for this session.";
      setLogoUploadError(
        typeof serverMsg === "string"
          ? serverMsg
          : "Could not upload to server immediately. Logo is cached for this session.",
      );
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    const confirmed = await confirm({
      title: "Remove Salon Logo",
      message:
        "Are you sure you want to remove the salon brand logo? Customer receipts and booking portal will default to text.",
      confirmText: "Remove Logo",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    setIsUploadingLogo(true);
    setLogoUploadError(null);
    try {
      await settingsService.deleteSalonLogo();
    } catch (err) {
      console.warn("Backend logo delete skipped or offline:", err);
    } finally {
      setFormData((prev) => ({ ...prev, logoUrl: null }));
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fetch real salon settings from Backend API
  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await settingsService.getGeneralSettings();
        if (mounted) {
          setFormData(data);
          if (data.language && data.language !== currentLang) {
            void i18n.changeLanguage(data.language);
            localStorage.setItem("salon_pos_lng", data.language);
          }
        }
      } catch (err) {
        console.error("Failed loading settings from API:", err);
        if (mounted) {
          setErrorMsg(
            "Unable to connect to the server. Working with saved offline settings.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, [currentLang, i18n]);

  const handleLanguageChange = (code: SupportedLanguage) => {
    void i18n.changeLanguage(code);
    localStorage.setItem("salon_pos_lng", code);
    setFormData((prev) => ({ ...prev, language: code }));
  };

  const handleBusinessHourChange = (
    dayIndex: number,
    field: keyof BusinessHourItem,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const hours = prev.businessHours ? [...prev.businessHours] : [];
      if (hours[dayIndex]) {
        hours[dayIndex] = {
          ...hours[dayIndex],
          [field]: value,
        };
      }
      return { ...prev, businessHours: hours };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const updated = await settingsService.updateGeneralSettings(formData);
      setFormData(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error("Failed saving general settings:", err);
      setErrorMsg(
        "Failed to save settings to server. Please check your network connection.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = await confirm({
      title: "Reset General Settings",
      message:
        "Are you sure you want to reset all general settings to system defaults? Operating hours, currency, and tax rate will revert to initial presets.",
      confirmText: "Reset Defaults",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!confirmed) return;

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const resetData = await settingsService.resetGeneralSettings();
      setFormData(resetData);
      void i18n.changeLanguage("en");
      localStorage.setItem("salon_pos_lng", "en");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error("Failed resetting general settings:", err);
      setErrorMsg("Failed resetting settings on server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-slate-900"
    >
      {/* Alert banner if error occurred */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
          <AlertCircle className="size-4 shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: SALON PROFILE INFORMATION                          */}
      {/* ========================================================= */}
      {activeTab === "profile" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Salon Profile Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details appear on customer invoices, appointment reminders,
              and receipts.
            </p>
          </div>

          {/* Salon Brand Logo Upload Section */}
          <div className="mb-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              {/* Logo Preview Avatar */}
              <div className="relative group shrink-0">
                <div className="size-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shadow-2xs transition-all group-hover:border-primary">
                  {displayLogoUrl ? (
                    <img
                      src={displayLogoUrl}
                      alt={formData.salonName || "Salon Logo"}
                      className="size-full object-contain p-1.5"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="size-8 stroke-1 text-slate-300 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-medium mt-1">
                        No Logo
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick overlay change button when logo exists */}
                {displayLogoUrl && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change logo"
                    className="absolute inset-0 rounded-2xl bg-black/45 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-medium"
                  >
                    <Camera className="size-5 mb-0.5" />
                    Change
                  </button>
                )}
              </div>

              {/* Logo Details & Actions */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Salon Logo
                  </h4>
                  {displayLogoUrl && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                      <Check className="size-2.5" /> Uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your official salon brand logo to appear on customer
                  invoices, POS receipts, and appointment notifications.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Recommended: Square PNG, JPG, WEBP, or SVG (Max 5MB).
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo || isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span>Uploading Logo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5 text-primary" />
                        <span>
                          {displayLogoUrl
                            ? "Upload New Logo"
                            : "Upload Salon Logo"}
                        </span>
                      </>
                    )}
                  </Button>

                  {displayLogoUrl && (
                    <Button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={isUploadingLogo || isSaving}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5 text-rose-600" />
                      <span>Remove Logo</span>
                    </Button>
                  )}
                </div>

                {logoUploadError && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{logoUploadError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              type="text"
              required
              label="Salon Business Name"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.salonName}
              onChange={(e) =>
                setFormData({ ...formData, salonName: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <Input
              type="tel"
              required
              label="Official Phone Number"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <Input
              type="email"
              required
              label="Contact Email"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <Input
              type="text"
              label="Physical Address / Branch"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Display Language
              </label>
              <select
                value={formData.language || currentLang}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as SupportedLanguage)
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer font-medium"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FINANCIAL & REGIONAL PREFERENCES                   */}
      {/* ========================================================= */}
      {activeTab === "financial" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Financial & Regional Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Currency formats, time zones, default tax rate, and system
              interface language.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Operating Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value="LKR (Rs.)">LKR (Rs.) - Sri Lankan Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>

            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              label="Default Service Tax (%)"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({ ...formData, taxRate: Number(e.target.value) })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Time Zone
              </label>
              <select
                value={formData.timeZone}
                onChange={(e) =>
                  setFormData({ ...formData, timeZone: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value="Asia/Colombo (GMT+5:30)">
                  Asia/Colombo (GMT+5:30)
                </option>
                <option value="Asia/Dubai (GMT+4:00)">
                  Asia/Dubai (GMT+4:00)
                </option>
                <option value="Asia/Singapore (GMT+8:00)">
                  Asia/Singapore (GMT+8:00)
                </option>
                <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
              </select>
            </div>
          </div>

          {/* Display Language*/}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="size-4 text-primary" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                System Language
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Select the interface display language for the salon POS system,
              navigation, and reports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected =
                  (formData.language || currentLang) === lang.code;
                return (
                  <Button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-subtle/30 ring-2 ring-primary/20 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-bold ${isSelected ? "text-primary" : "text-slate-800"}`}
                      >
                        {lang.nativeLabel}
                      </p>
                      <p className="text-[11px] text-slate-500">{lang.label}</p>
                    </div>
                    {isSelected && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SALON DAILY OPERATING HOURS                         */}
      {/* ========================================================= */}
      {activeTab === "operations" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Salon Daily Operating Hours
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Controls appointment booking calendar slots, cashier terminal
              opening, and business hours.
            </p>
          </div>

          {/* Global Quick Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <Input
              type="time"
              label="Standard Opening Time"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.openingTime}
              onChange={(e) =>
                setFormData({ ...formData, openingTime: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />

            <Input
              type="time"
              label="Standard Closing Time"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.closingTime}
              onChange={(e) =>
                setFormData({ ...formData, closingTime: e.target.value })
              }
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />
          </div>

          {/* 7-Day Business Hours Schedule */}
          {formData.businessHours && formData.businessHours.length > 0 && (
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-4 text-primary" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Weekly Operating Schedule (7 Days)
                </h4>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden">
                {formData.businessHours.map((bh, idx) => (
                  <div
                    key={bh.day_of_week}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 text-xs transition ${
                      bh.is_closed
                        ? "bg-slate-50/80 text-slate-400"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-40">
                      <span className="font-bold text-slate-800">
                        {bh.day_name}
                      </span>
                      {bh.is_closed && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          Closed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-slate-400" />
                        <input
                          type="time"
                          disabled={bh.is_closed}
                          value={bh.opening_time}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              idx,
                              "opening_time",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs disabled:opacity-50 disabled:bg-slate-100"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          disabled={bh.is_closed}
                          value={bh.closing_time}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              idx,
                              "closing_time",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs disabled:opacity-50 disabled:bg-slate-100"
                        />
                      </div>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bh.is_closed}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              idx,
                              "is_closed",
                              e.target.checked,
                            )
                          }
                          className="rounded border-slate-300 text-primary focus:ring-primary/20"
                        />
                        <span className="text-[11px] font-medium text-slate-600">
                          Mark Closed
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions bottom bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isSaved
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-primary hover:bg-primary-dark"
          } disabled:opacity-60`}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="size-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>
                {activeTab === "profile"
                  ? "Save Salon Profile"
                  : activeTab === "financial"
                    ? "Save Financial Preferences"
                    : "Save Operating Hours"}
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationDialog />
    </form>
  );
}

export default GeneralSettingsView;
