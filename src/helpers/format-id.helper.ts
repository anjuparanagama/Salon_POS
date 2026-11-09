/**
 * Helper utilities to format verbose database UUIDs into clean, human-readable IDs
 * e.g.:
 *  b1000000-0000-0000-0000-000000000008 -> #APT-008
 *  APT-DEMO-001 -> #APT-001
 *  f1000000-0000-0000-0000-000000000001 -> #STF-001
 */

export function formatAppointmentId(
  idOrNum?: string | { id?: string; appointmentNumber?: string }
): string {
  if (!idOrNum) return "#APT-001";

  if (typeof idOrNum === "object") {
    if (idOrNum.appointmentNumber) {
      return formatAppointmentId(idOrNum.appointmentNumber);
    }
    return formatAppointmentId(idOrNum.id);
  }

  const str = String(idOrNum).trim().replace(/^#/, "");

  // If demo appointment code e.g. APT-DEMO-001
  const demoMatch = str.match(/APT[_-]?DEMO[_-]?(\w+)/i);
  if (demoMatch && demoMatch[1]) {
    const code = demoMatch[1];
    if (/^\d+$/.test(code)) {
      return `#APT-${String(parseInt(code, 10)).padStart(3, "0")}`;
    }
    return `#APT-${code.toUpperCase()}`;
  }

  // If standard appointment code e.g. APT-001, APT-0005, APT-59
  const aptMatch = str.match(/^APT[_-]?(\d+)$/i);
  if (aptMatch && aptMatch[1]) {
    return `#APT-${String(parseInt(aptMatch[1], 10)).padStart(3, "0")}`;
  }

  // If general APT- prefix with alphanumeric e.g. APT-001, APT-abc
  const aptGeneral = str.match(/^APT[_-]?(.*)$/i);
  const cleanCode = aptGeneral ? aptGeneral[1] : str;

  // If purely numeric e.g. 1, 5, 059
  if (/^\d+$/.test(cleanCode)) {
    return `#APT-${String(parseInt(cleanCode, 10)).padStart(3, "0")}`;
  }

  // If UUID or long string with hyphens e.g. 3128360b-321c-4def-9d9b-96c0bb375176
  if (cleanCode.includes("-") || cleanCode.length >= 16) {
    const trailingDigits = cleanCode.match(/(\d+)$/);
    if (trailingDigits && trailingDigits[1] && trailingDigits[1].length <= 5) {
      const num = parseInt(trailingDigits[1], 10);
      return `#APT-${String(num <= 999 ? num : (num % 900) + 100).padStart(3, "0")}`;
    }
    // Take last 4 hex characters and convert to a neat 3-digit number (e.g. 100 - 999)
    const cleanHex = cleanCode.replace(/[^0-9a-fA-F]/g, "");
    const hexVal = parseInt(cleanHex.slice(-4), 16);
    if (!isNaN(hexVal)) {
      return `#APT-${String((hexVal % 900) + 100).padStart(3, "0")}`;
    }
    return `#APT-001`;
  }

  // Any other alphanumeric code e.g. "059" or "A12"
  const digits = cleanCode.match(/\d+/);
  if (digits) {
    return `#APT-${String(parseInt(digits[0], 10)).padStart(3, "0")}`;
  }

  return `#APT-${cleanCode.slice(-4).toUpperCase()}`;
}

export function formatStaffId(id?: string): string {
  if (!id) return "#STF-001";
  const str = String(id).trim().replace(/^#/, "").replace(/^st-?/i, "");

  // If already like STF-001
  const stfMatch = str.match(/STF[_-]?(\w+)/i);
  if (stfMatch && stfMatch[1]) {
    const code = stfMatch[1];
    if (/^\d+$/.test(code)) {
      return `#STF-${String(parseInt(code, 10)).padStart(3, "0")}`;
    }
    return `#STF-${code.toUpperCase()}`;
  }

  // Handle legacy 20000000 series (shift by 5 so they map to 006 - 010)
  if (str.startsWith("20000000-0000-0000-0000-")) {
    const trailing = str.match(/(\d+)$/);
    if (trailing && trailing[1]) {
      const num = parseInt(trailing[1], 10);
      return `#STF-${String(num + 5).padStart(3, "0")}`;
    }
  }

  if (str.includes("-") || str.length >= 16) {
    const trailingDigits = str.match(/0*(\d+)$/);
    if (trailingDigits && trailingDigits[1] && trailingDigits[1].length <= 6) {
      return `#STF-${String(parseInt(trailingDigits[1], 10)).padStart(3, "0")}`;
    }
    return `#STF-${str.slice(-4).toUpperCase()}`;
  }

  if (/^\d+$/.test(str)) {
    return `#STF-${str.padStart(3, "0")}`;
  }

  return `#STF-${str.toUpperCase()}`;
}

