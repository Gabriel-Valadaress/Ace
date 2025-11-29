/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate Brazilian CPF
 */
export const isValidCpf = (cpf) => {
  // Remove non-numeric characters
  cpf = cpf.replace(/\D/g, '');

  // Must have 11 digits
  if (cpf.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  if (secondCheck !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false; // uppercase
  if (!/[a-z]/.test(password)) return false; // lowercase
  if (!/[0-9]/.test(password)) return false; // number
  return true;
};

/**
 * Get password strength (0-4)
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++; // special chars (bonus)
  return Math.min(strength, 4);
};

/**
 * Validate Brazilian phone number
 */
export const isValidPhone = (phone) => {
  // Remove non-numeric characters
  phone = phone.replace(/\D/g, '');

  // Must have 10 or 11 digits
  if (phone.length !== 10 && phone.length !== 11) return false;

  // Validate DDD (area code)
  const ddd = parseInt(phone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  // If 11 digits, third digit must be 9 (mobile)
  if (phone.length === 11 && phone.charAt(2) !== '9') return false;

  return true;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
  return value && value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value, max) => {
  return !value || value.length <= max;
};

/**
 * Validate date (must be in the past)
 */
export const isPastDate = (date) => {
  const d = new Date(date);
  return d < new Date();
};

/**
 * Validate minimum age
 */
export const isMinAge = (birthDate, minAge) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= minAge;
};

/**
 * Create validation function for login form
 */
export const validateLoginForm = (values) => {
  const errors = {};

  if (!isRequired(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(values.password)) {
    errors.password = 'Password is required';
  }

  return errors;
};

/**
 * Create validation function for register form
 */
export const validateRegisterForm = (values) => {
  const errors = {};

  if (!isRequired(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(values.cpf)) {
    errors.cpf = 'CPF is required';
  } else if (!isValidCpf(values.cpf)) {
    errors.cpf = 'Invalid CPF';
  }

  if (!isRequired(values.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must have at least 8 characters, one uppercase, one lowercase, and one number';
  }

  if (!isRequired(values.confirmPassword)) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

/**
 * Create validation function for profile form
 */
export const validateProfileForm = (values) => {
  const errors = {};

  if (!isRequired(values.fullName)) {
    errors.fullName = 'Full name is required';
  } else if (!minLength(values.fullName, 3)) {
    errors.fullName = 'Name must be at least 3 characters';
  }

  if (!isRequired(values.birthDate)) {
    errors.birthDate = 'Birth date is required';
  } else if (!isPastDate(values.birthDate)) {
    errors.birthDate = 'Birth date must be in the past';
  } else if (!isMinAge(values.birthDate, 10)) {
    errors.birthDate = 'Minimum age is 10 years';
  }

  if (!isRequired(values.phoneNumber)) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhone(values.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  if (values.height && (values.height < 100 || values.height > 250)) {
    errors.height = 'Height must be between 100 and 250 cm';
  }

  return errors;
};

export default {
  isValidEmail,
  isValidCpf,
  isValidPassword,
  getPasswordStrength,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  isPastDate,
  isMinAge,
  validateLoginForm,
  validateRegisterForm,
  validateProfileForm,
};