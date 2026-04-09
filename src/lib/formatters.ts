/**
 * Formats a number as INR currency (₹) with Indian numbering system (Lakhs/Crores).
 */
export const formatINR = (amount: number, compact = false): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  });
  return formatter.format(amount);
};

/**
 * Formats a date string to a readable format.
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a month string (YYYY-MM) to a readable format.
 */
export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit',
  });
};
