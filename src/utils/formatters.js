import { CURRENCY_SYMBOLS, CATEGORY_COLORS } from '../constants';

/**
 * Centralized currency formatter
 * E.g., ₹1,250 or $45.50
 */
export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';

  // Format with commas based on locale
  const formattedNumber = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(num);

  return `${symbol}${formattedNumber}`;
}

/**
 * Timezone-safe date formatter
 * Avoids UTC offset rollback
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateString;
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }
  return dateString;
}

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonth() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#6366F1';
}
