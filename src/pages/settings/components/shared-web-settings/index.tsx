import { useState, useEffect, type FormEvent } from "react";
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Share2,
  Search,
  Star,
  Users,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Link2,
} from "lucide-react";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { FormSkeleton } from "../../../../components/skeleton";
import { sharedWebService } from "../../../../services/shared-web.service";
import { PUBLIC_WEB_URL } from "../../../../config/api.config";
import type {
  SharedWebSettingsState,
  SharedWebSettingsUpdateRequest,
} from "../../../../interface/shared-web.types";

type SharedWebTab = "branding" | "theme" | "booking" | "social_seo" | "preview";

const THEME_OPTIONS = [
  {
    id: "default",
    name: "Modern Chic (Default)",
    description: "Vibrant rose accents with crisp typography, balanced borders, and contemporary layouts.",
    previewBg: "from-pink-500 to-rose-600",
    primary: "#380721",
    secondary: "#EA7860",
  },
  {
    id: "luxury",
    name: "Royal Executive Luxury",
    description: "Opulent champagne gold, dark navy hues, serif elegance, and VIP styling.",
    previewBg: "from-amber-600 to-slate-900",
    primary: "#18141F",
    secondary: "#D49520",
  },
  {
    id: "minimal",
    name: "Minimalist Studio",
    description: "Subtle monochrome palettes, sleek modern lines, and focus on clean white space.",
    previewBg: "from-slate-700 to-slate-950",
    primary: "#1E293B",
    secondary: "#0284C7",
  },
  {
    id: "vibrant",
    name: "Vibrant Tropical",
    description: "Energetic emerald & violet tones, tropical aesthetic, and expressive creative vibe.",
    previewBg: "from-emerald-500 to-teal-700",
    primary: "#064E3B",
    secondary: "#7C3AED",
  },
  {
    id: "dark",
    name: "Midnight Salon & Spa",
    description: "Deep obsidian theme with glowing neon highlights for modern nightlife & boutique salons.",
    previewBg: "from-purple-900 to-slate-950",
    primary: "#0D0C15",
    secondary: "#A855F7",
  },
];

const PRESET_PRIMARY_COLORS = [
  "#EC4899", // Rose / Pink
  "#D97706", // Gold / Amber
  "#8B5CF6", // Violet / Purple
  "#10B981", // Emerald / Green
  "#0EA5E9", // Sky / Blue
  "#F43F5E", // Ruby / Red
  "#14B8A6", // Teal
  "#1E293B", // Slate / Dark
];

const PRESET_SECONDARY_COLORS = [
  "#8B5CF6", // Violet
  "#EC4899", // Rose
  "#0F172A", // Navy
  "#F59E0B", // Amber
  "#06B6D4", // Cyan
  "#64748B", // Cool Slate
];

export function SharedWebSettingsView() {
  const [activeTab, setActiveTab] = useState<SharedWebTab>("branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState<SharedWebSettingsState>({
    id: "",
    name: "",
    slug: "",
    phone: "",
    email: "",
    address: "",
    logo_url: "",
    cover_image_url: "",
    description: "",
    timezone: "Asia/Colombo",
    currency: "LKR",
    theme: "default",
    primary_color: "#EC4899",
    secondary_color: "#8B5CF6",
    show_services: true,
    show_products: true,
    show_prices: true,
    allow_online_booking: true,
    booking_requires_approval: true,
    whatsapp_number: "",
    facebook_url: "",
    instagram_url: "",
    seo_title: "",
    seo_description: "",
    business_hours: [],
    holidays: [],
    is_open_now: false,
    today_hours: "Closed",
    stats: {
      total_services: 0,
      total_staff: 0,
      rating: 4.9,
      reviews_count: 0,
    },
    is_published: true,
    public_url: "",
  });

  const [initialData, setInitialData] = useState<SharedWebSettingsState | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await sharedWebService.getSharedWebSettings();
        if (isMounted) {
          setFormData(data);
          setInitialData(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Unable to load online booking settings. Please check your connection and try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const publicLink = `${PUBLIC_WEB_URL}/salon/${formData.slug || "sribees"}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleTogglePublish = async () => {
    setPublishing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const updated = formData.is_published
        ? await sharedWebService.unpublishWebsite()
        : await sharedWebService.publishWebsite();
      setFormData(updated);
      setInitialData(updated);
      setSuccessMsg(
        updated.is_published
          ? "🎉 Public salon website is now published and accessible online!"
          : "Public salon website has been switched to Private / Draft mode."
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to change website publication state."
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: SharedWebSettingsUpdateRequest = {
      name: formData.name,
      slug: formData.slug,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      logo_url: formData.logo_url || null,
      cover_image_url: formData.cover_image_url || null,
      description: formData.description || null,
      timezone: formData.timezone,
      currency: formData.currency,
      theme: formData.theme,
      primary_color: formData.primary_color,
      secondary_color: formData.secondary_color,
      show_services: formData.show_services,
      show_products: formData.show_products,
      show_prices: formData.show_prices,
      allow_online_booking: formData.allow_online_booking,
      booking_requires_approval: formData.booking_requires_approval,
      whatsapp_number: formData.whatsapp_number || null,
      facebook_url: formData.facebook_url || null,
      instagram_url: formData.instagram_url || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      is_published: formData.is_published,
    };

    try {
      const res = await sharedWebService.updateSharedWebSettings(payload);
      setFormData(res);
      setInitialData(res);
      setSuccessMsg("✅ Shared Web settings and public profile saved successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to save Shared Web settings. Please check your inputs and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetToInitial = () => {
    if (initialData) {
      setFormData(initialData);
      setSuccessMsg("Form reset to currently saved configuration.");
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 text-slate-900">
      {/* Top Banner: Public Link & Publication Status */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span
              className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm shrink-0"
              style={{
                background: `linear-gradient(135deg, ${formData.primary_color || "#EC4899"}, ${formData.secondary_color || "#8B5CF6"})`,
              }}
            >
              <Globe className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">
                  Shared Web & Public Salon Booking
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    formData.is_published
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      formData.is_published ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {formData.is_published ? "Published & Live Online" : "Draft / Private"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Configure your public web branding, customer booking policies, live catalog
                visibility, and social media channels.
              </p>
            </div>
          </div>

          {/* Quick Actions: Copy Link, Open Web, Publish Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="size-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4 text-slate-500" />
                  <span>Copy Web Link</span>
                </>
              )}
            </Button>

            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <ExternalLink className="size-4 text-slate-500" />
              <span>Preview Public Page</span>
            </a>

            <Button
              type="button"
              disabled={publishing}
              onClick={handleTogglePublish}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer ${
                formData.is_published
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {publishing ? (
                <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : formData.is_published ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              <span>{formData.is_published ? "Unpublish Website" : "Publish Live Website"}</span>
            </Button>
          </div>
        </div>

        {/* Live URL Pill */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-600 overflow-x-auto">
          <Link2 className="size-3.5 text-slate-400 shrink-0" />
          <span className="font-mono text-[11px] text-slate-700 font-medium truncate">
            {publicLink}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-800">
          <AlertCircle className="size-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "branding"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <ImageIcon className="size-3.5" />
          <span>Profile & Brand</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "theme"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Palette className="size-3.5" />
          <span>Theme & Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("booking")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "booking"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Scissors className="size-3.5" />
          <span>Booking & Visibility</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social_seo")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "social_seo"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Share2 className="size-3.5" />
          <span>Social & SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "preview"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Sparkles className="size-3.5" />
          <span>Live Card & Hours</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ==================================================================== */}
        {/* TAB 1: BRANDING & PROFILE */}
        {/* ==================================================================== */}
        {activeTab === "branding" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Salon Profile & Identity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These details appear on your public web page header, contact card, and customer
                booking portal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Salon Business Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sribees Luxury Salon & Spa"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Web URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder="e.g., sribees-salon"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Public URL: <strong className="text-slate-800">{PUBLIC_WEB_URL}/salon/{formData.slug || "your-salon"}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Public Phone <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +94 77 123 4567"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., contact@sribees.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Physical Address / Branch Location <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., No. 42, Galle Road, Colombo 03, Sri Lanka"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Salon Logo Image URL
                </label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://.../logo.png"
                />
                {formData.logo_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={formData.logo_url}
                      alt="Logo Preview"
                      className="size-10 rounded-xl object-cover border border-slate-200"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                    <span className="text-[11px] text-slate-500">Logo preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cover / Hero Banner Image URL
                </label>
                <Input
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://.../hero-banner.jpg"
                />
                {formData.cover_image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.cover_image_url}
                      alt="Cover Preview"
                      className="h-16 w-full rounded-xl object-cover border border-slate-200"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  About Salon / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write a warm, welcoming description highlighting your expert stylists, signature services, and luxury atmosphere..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: THEME & BRAND COLORS */}
        {/* ==================================================================== */}
        {activeTab === "theme" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Branding Theme & Accent Colors</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize how your public website looks to match your salon's signature aesthetic.
              </p>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2.5">
                Layout Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_OPTIONS.map((thm) => {
                  const isSelected = (formData.theme || "default") === thm.id;
                  return (
                    <div
                      key={thm.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          theme: thm.id,
                          primary_color: thm.primary,
                          secondary_color: thm.secondary,
                        })
                      }
                      className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition ${
                        isSelected
                          ? "border-primary bg-primary-subtle/30 ring-1 ring-primary"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{thm.name}</span>
                          {isSelected && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {thm.description}
                        </p>
                      </div>
                      <div
                        className={`mt-3 h-2 w-full rounded-full bg-gradient-to-r ${thm.previewBg}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Primary Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primary_color || "#EC4899"}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="size-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#EC4899"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {PRESET_PRIMARY_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, primary_color: hex })}
                      className="size-6 rounded-full border border-slate-300 transition hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondary_color || "#8B5CF6"}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="size-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#8B5CF6"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {PRESET_SECONDARY_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, secondary_color: hex })}
                      className="size-6 rounded-full border border-slate-300 transition hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Visual Card */}
            <div
              className="rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between gap-4"
              style={{
                background: `linear-gradient(135deg, ${formData.primary_color || "#EC4899"}, ${formData.secondary_color || "#8B5CF6"})`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {formData.theme?.toUpperCase() || "DEFAULT"} THEME PREVIEW
                </span>
                <span className="text-xs font-semibold">Live Color Blend</span>
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight">{formData.name || "Your Salon Name"}</h4>
                <p className="text-xs text-white/90 mt-1 line-clamp-1">
                  {formData.description || "Luxury treatments, haircuts, styling & spa care."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: BOOKING RULES & VISIBILITY */}
        {/* ==================================================================== */}
        {activeTab === "booking" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Customer Online Booking & Catalog Visibility
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control whether clients can book appointments online and which sections are publicly
                displayed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allow Online Booking */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Allow Online Booking</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow customers to book appointments directly via your public web link.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allow_online_booking}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_online_booking: e.target.checked })
                  }
                  className="size-5 accent-primary cursor-pointer rounded"
                />
              </div>

              {/* Require Approval */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Online Bookings Require Approval
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When enabled, bookings remain in Pending state until staff confirms them.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.booking_requires_approval}
                  onChange={(e) =>
                    setFormData({ ...formData, booking_requires_approval: e.target.checked })
                  }
                  className="size-5 accent-primary cursor-pointer rounded"
                />
              </div>

              {/* Show Services */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show Services Catalog</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Display your public service menu and duration details.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.show_services}
                  onChange={(e) => setFormData({ ...formData, show_services: e.target.checked })}
                  className="size-5 accent-primary cursor-pointer rounded"
                />
              </div>

              {/* Show Products */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show Retail Products</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Display retail haircare & beauty products on the public website.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.show_products}
                  onChange={(e) => setFormData({ ...formData, show_products: e.target.checked })}
                  className="size-5 accent-primary cursor-pointer rounded"
                />
              </div>

              {/* Show Prices */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 sm:col-span-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Display Prices on Public Website
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When turned off, service and product prices will be hidden from public visitors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.show_prices}
                  onChange={(e) => setFormData({ ...formData, show_prices: e.target.checked })}
                  className="size-5 accent-primary cursor-pointer rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: SOCIAL LINKS & SEO */}
        {/* ==================================================================== */}
        {activeTab === "social_seo" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Social Channels & Search SEO</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your social media accounts and configure metadata for Google search rankings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  WhatsApp Hotline Number (with country code)
                </label>
                <Input
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="e.g., +94771234567"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Enables a floating WhatsApp chat button for direct booking inquiries.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Facebook Page URL
                </label>
                <Input
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/your-salon"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Instagram Profile URL
                </label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/your-salon"
                />
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3">Google SEO Meta Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      SEO Meta Title
                    </label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="e.g., Sribees Luxury Salon & Day Spa | Colombo, Sri Lanka"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seo_description}
                      onChange={(e) =>
                        setFormData({ ...formData, seo_description: e.target.value })
                      }
                      placeholder="Book online for hair coloring, facials, bridal dressing, and relaxation spa treatments in Colombo..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>

                {/* Google Search Snippet Preview */}
                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                    <Search className="size-3 text-slate-400" />
                    <span>Google Search Result Preview</span>
                  </div>
                  <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                    {formData.seo_title || formData.name || "Salon Business Title"}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-mono mt-0.5 truncate">
                    {publicLink}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {formData.seo_description ||
                      formData.description ||
                      "Luxury hair treatments, bridal dressing, facials, manicure and spa appointments."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: LIVE CARD & HOURS OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === "preview" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Web Status & Hours</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time snapshot returned by <code className="text-primary font-mono text-[11px]">GET /api/v1/public/salons/{formData.slug}</code>
              </p>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block">Open Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${
                      formData.is_open_now ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-sm font-bold text-slate-900">
                    {formData.is_open_now ? "Open Now" : "Currently Closed"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Today: {formData.today_hours}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Active Services
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Scissors className="size-4 text-primary" />
                  <span className="text-sm font-bold text-slate-900">
                    {formData.stats?.total_services ?? 0} Services
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Live on web catalog</span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block">Active Stylists</span>
                <div className="mt-1 flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span className="text-sm font-bold text-slate-900">
                    {formData.stats?.total_staff ?? 0} Specialists
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Bookable online</span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block">Customer Rating</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-900">
                    {formData.stats?.rating ?? 4.9} / 5.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {formData.stats?.reviews_count ?? 25}+ Verified Reviews
                </span>
              </div>
            </div>

            {/* Weekly Operating Hours List */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2.5">
                Weekly Operating Schedule (7 Days)
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {formData.business_hours && formData.business_hours.length > 0 ? (
                  formData.business_hours.map((bh) => (
                    <div
                      key={bh.day_of_week}
                      className="flex items-center justify-between p-3 bg-white hover:bg-slate-50"
                    >
                      <span className="font-semibold text-slate-800">{bh.day_name}</span>
                      <span
                        className={`font-mono text-[11px] ${
                          bh.is_closed ? "text-rose-600 font-bold" : "text-slate-600"
                        }`}
                      >
                        {bh.is_closed ? "Closed" : `${bh.opening_time} - ${bh.closing_time}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-slate-400 italic">No business hours configured.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <Button
            type="button"
            onClick={handleResetToInitial}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Changes</span>
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="size-4" />
            )}
            <span>{saving ? "Saving Changes..." : "Save Shared Web Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SharedWebSettingsView;
