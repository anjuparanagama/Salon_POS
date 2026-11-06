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
      return `#APT-D${String(parseInt(code, 10)).padStart(3, "0")}`;
    }
    return `#APT-D${code.toUpperCase()}`;
  }

  // If standard appointment code e.g. APT-0001
  const aptMatch = str.match(/APT[_-]?(\w+)/i);
  if (aptMatch && aptMatch[1]) {
    const code = aptMatch[1];
    if (/^\d+$/.test(code)) {
      return `#APT-${String(parseInt(code, 10)).padStart(3, "0")}`;
    }
    if (code.length > 5) {
      const subMatch = code.match(/(\d+)$/);
      if (subMatch && subMatch[1]) {
        return `#APT-${String(parseInt(subMatch[1], 10)).padStart(3, "0")}`;
      }
      return `#APT-${code.slice(-4).toUpperCase()}`;
    }
    return `#APT-${code.toUpperCase()}`;
  }

  // If it's a UUID (contains hyphens or is long)
  if (str.includes("-") || str.length >= 16) {
    const trailingDigits = str.match(/(\d+)$/);
    if (trailingDigits && trailingDigits[1] && trailingDigits[1].length <= 6) {
      return `#APT-${String(parseInt(trailingDigits[1], 10)).padStart(3, "0")}`;
    }
    return `#APT-${str.slice(-4).toUpperCase()}`;
  }

  if (/^\d+$/.test(str)) {
    return `#APT-${str.padStart(3, "0")}`;
  }

  return `#APT-${str.toUpperCase()}`;
}

export function formatStaffId(id?: string): string {
  if (!id) return "#STF-001";
  const str = String(id).trim().replace(/^#/, "").replace(/^st-?/i, "");

  if (str.includes("-") || str.length >= 16) {
    const trailingDigits = str.match(/(\d+)$/);
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

