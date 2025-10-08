/**
 * Format number to Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places (default: false)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Format number to compact Indonesian Rupiah (e.g., Rp 1,5 Jt)
 * @param amount - The amount to format
 * @returns Formatted compact currency string
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)} Rb`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format number with thousand separators (no currency symbol)
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('id-ID');
}