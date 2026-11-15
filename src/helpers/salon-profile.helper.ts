export interface SalonProfileInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string | null;
}

/**
 * Resolves active salon profile info from invoice data, general settings cache, or authenticated user session.
 * Ensures receipts and invoices always reflect the logged-in tenant salon instead of hardcoded defaults.
 */
export function getActiveSalonProfile(override?: Partial<SalonProfileInfo> | null): SalonProfileInfo {
  // 1. Direct override provided (e.g., from invoice API payload)
  if (override?.name && override.name.trim().length > 0) {
    let fallbackAddress = override.address || "";
    let fallbackPhone = override.phone || "";
    let fallbackEmail = override.email || "";

    // If some fields are blank in override, enrich from saved settings if available
    if (!fallbackAddress || !fallbackPhone || !fallbackEmail) {
      try {
        const saved = localStorage.getItem("sribees_general_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!fallbackAddress && parsed.address) fallbackAddress = parsed.address;
          if (!fallbackPhone && parsed.phone) fallbackPhone = parsed.phone;
          if (!fallbackEmail && parsed.email) fallbackEmail = parsed.email;
        }
      } catch {
        // ignore storage errors
      }
    }

    return {
      name: override.name,
      address: fallbackAddress,
      phone: fallbackPhone,
      email: fallbackEmail,
      logoUrl: override.logoUrl,
    };
  }

  // 2. Read from localStorage saved general settings
  try {
    const saved = localStorage.getItem("sribees_general_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.salonName && parsed.salonName.trim().length > 0) {
        return {
          name: parsed.salonName,
          address: parsed.address || "",
          phone: parsed.phone || "",
          email: parsed.email || "",
          logoUrl: override?.logoUrl,
        };
      }
    }
  } catch {
    // ignore storage errors
  }

  // 3. Read from auth user in storage
  try {
    const authStored =
      localStorage.getItem("salon_pos_user") || sessionStorage.getItem("salon_pos_user");
    if (authStored) {
      const user = JSON.parse(authStored);
      if (user.salonName || user.name) {
        return {
          name: user.salonName || user.name,
          address: override?.address || "",
          phone: override?.phone || "",
          email: user.email || override?.email || "",
          logoUrl: override?.logoUrl,
        };
      }
    }
  } catch {
    // ignore storage errors
  }

  // 4. Clean generic fallback
  return {
    name: "Salon & Spa",
    address: "",
    phone: "",
    email: "",
    logoUrl: null,
  };
}
