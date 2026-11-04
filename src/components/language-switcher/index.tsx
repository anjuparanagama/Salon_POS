import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Check, ChevronDown } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../interface/i18n.types";

export type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize language code (e.g., 'en-US' -> 'en')
  const currentLang = (i18n.language?.split("-")[0] || "en") as SupportedLanguage;

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (code: SupportedLanguage) => {
    void i18n.changeLanguage(code);
    localStorage.setItem("salon_pos_lng", code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        title="Change Language"
        aria-label="Change Language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 sm:h-8.5 items-center gap-1.5 rounded-full bg-[#FDF2F7] px-2.5 sm:px-3 text-xs font-medium text-[#D9145A] hover:bg-[#FCE8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] cursor-pointer"
      >
        <Languages aria-hidden="true" className="size-3.5 sm:size-4 shrink-0" strokeWidth={2.25} />
        <span className="hidden md:inline font-semibold">{currentOption.nativeLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3 text-[#D9145A] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#FDF2F7] font-semibold text-[#D9145A]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>{lang.nativeLabel}</span>
                  <span className="text-[11px] text-slate-400 font-normal">{lang.label}</span>
                </div>
                {isSelected && <Check aria-hidden="true" className="size-4 text-[#D9145A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

