export type SupportedLanguage = "en" | "si" | "ta";

export type LanguageOption = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag?: string;
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

