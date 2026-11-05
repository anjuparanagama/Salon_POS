export type FormatPriceOptions = {
  /** Number of decimal places (default is 2) */
  decimals?: number;
  /** Currency symbol to display (default is "Rs.") */
  symbol?: string;
  /** Whether to display the currency symbol (default is true) */
  showSymbol?: boolean;
  /** Whether to place a space between symbol and amount (default is false) */
  space?: boolean;
};

export const DEFAULT_CURRENCY_SYMBOL = "Rs.";

/**
 * Formats a numeric price into a formatted currency string in Rupees (e.g., "Rs.1,113.00").
 *
 * @param amount - The numeric value or string number to format
 * @param options - Formatting options or number of decimals
 * @returns Formatted price string with "Rs."
 */
export function formatPrice(
  amount: number | string | null | undefined,
  options?: FormatPriceOptions | number
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${DEFAULT_CURRENCY_SYMBOL}0.00`;
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const opts: FormatPriceOptions =
    typeof options === "number" ? { decimals: options } : (options ?? {});

  const decimals = opts.decimals !== undefined ? opts.decimals : 2;
  const symbol = opts.symbol ?? DEFAULT_CURRENCY_SYMBOL;
  const showSymbol = opts.showSymbol !== false;
  const space = opts.space ? " " : "";

  const formattedNumber = absNum.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const sign = isNegative ? "-" : "";

  if (!showSymbol) {
    return `${sign}${formattedNumber}`;
  }

  return `${sign}${symbol}${space}${formattedNumber}`;
}

export default formatPrice;

