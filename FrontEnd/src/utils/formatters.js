/**
 * Formatting utility functions
 */

/**
 * Format CPF: 12345678910 → 123.456.789-10
 */
export const formatCpf = (cpf) => {
  if (!cpf) return '';
  
  // Remove non-numeric characters
  const numbers = cpf.replace(/\D/g, '');
  
  // Apply mask
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};

/**
 * Unformat CPF: 123.456.789-10 → 12345678910
 */
export const unformatCpf = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

/**
 * Format phone: 51999887766 → (51) 99988-7766
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Apply mask based on length
  if (numbers.length <= 10) {
    // Landline: (XX) XXXX-XXXX
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14);
  } else {
    // Mobile: (XX) XXXXX-XXXX
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  }
};

/**
 * Unformat phone: (51) 99988-7766 → 51999887766
 */
export const unformatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Format date: 1995-05-15 → 15/05/1995
 */
export const formatDate = (date, locale = 'pt-BR') => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString(locale);
};

/**
 * Format date for input: 1995-05-15T00:00:00 → 1995-05-15
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format date and time: 2024-01-15T14:30:00 → 15/01/2024 14:30
 */
export const formatDateTime = (dateTime, locale = 'pt-BR') => {
  if (!dateTime) return '';
  
  const d = new Date(dateTime);
  return d.toLocaleString(locale);
};

/**
 * Format relative time: "2 hours ago", "3 days ago"
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format height: 180 → 1.80m
 */
export const formatHeight = (heightCm) => {
  if (!heightCm) return '';
  
  const meters = heightCm / 100;
  return `${meters.toFixed(2)}m`;
};

/**
 * Format win rate: 0.75 → 75%
 */
export const formatWinRate = (rate) => {
  if (rate === null || rate === undefined) return '0%';
  return `${rate.toFixed(1)}%`;
};

/**
 * Format number with thousands separator: 1000 → 1.000
 */
export const formatNumber = (number, locale = 'pt-BR') => {
  if (number === null || number === undefined) return '0';
  return number.toLocaleString(locale);
};

/**
 * Format currency: 100 → R$ 100,00
 */
export const formatCurrency = (value, currency = 'BRL', locale = 'pt-BR') => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Get initials from name: "John Silva" → "JS"
 */
export const getInitials = (name, maxChars = 2) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .substring(0, maxChars)
    .toUpperCase();
};

/**
 * Format file size: 1024 → "1 KB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  formatCpf,
  unformatCpf,
  formatPhone,
  unformatPhone,
  formatDate,
  formatDateForInput,
  formatDateTime,
  formatRelativeTime,
  calculateAge,
  formatHeight,
  formatWinRate,
  formatNumber,
  formatCurrency,
  truncateText,
  capitalize,
  getInitials,
  formatFileSize,
};