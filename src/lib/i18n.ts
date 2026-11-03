import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English resources
import enCommon from "../locales/en/common.json";
import enDashboard from "../locales/en/dashboard.json";
import enAppointments from "../locales/en/appointments.json";
import enServices from "../locales/en/services.json";
import enProducts from "../locales/en/products.json";
import enLedger from "../locales/en/ledger.json";

// Sinhala resources
import siCommon from "../locales/si/common.json";
import siDashboard from "../locales/si/dashboard.json";
import siAppointments from "../locales/si/appointments.json";
import siServices from "../locales/si/services.json";
import siProducts from "../locales/si/products.json";
import siLedger from "../locales/si/ledger.json";

// Tamil resources
import taCommon from "../locales/ta/common.json";
import taDashboard from "../locales/ta/dashboard.json";
import taAppointments from "../locales/ta/appointments.json";
import taServices from "../locales/ta/services.json";
import taProducts from "../locales/ta/products.json";
import taLedger from "../locales/ta/ledger.json";

export const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    appointments: enAppointments,
    services: enServices,
    products: enProducts,
    ledger: enLedger,
  },
  si: {
    common: siCommon,
    dashboard: siDashboard,
    appointments: siAppointments,
    services: siServices,
    products: siProducts,
    ledger: siLedger,
  },
  ta: {
    common: taCommon,
    dashboard: taDashboard,
    appointments: taAppointments,
    services: taServices,
    products: taProducts,
    ledger: taLedger,
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "dashboard", "appointments", "services", "products", "ledger"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "salon_pos_lng",
    },
  });

export default i18n;

