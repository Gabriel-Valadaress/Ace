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
    errors.email = 'E-mail é obrigatório';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Formato de e-mail inválido';
  }

  if (!isRequired(values.password)) {
    errors.password = 'Senha é obrigatória';
  }

  return errors;
};

/**
 * Create validation function for register form
 */
export const validateRegisterForm = (values) => {
  const errors = {};

  if (!isRequired(values.email)) {
    errors.email = 'E-mail é obrigatório';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Formato de e-mail inválido';
  }

  if (!isRequired(values.cpf)) {
    errors.cpf = 'CPF é obrigatório';
  } else if (!isValidCpf(values.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  if (!isRequired(values.password)) {
    errors.password = 'Senha é obrigatória';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número';
  }

  if (!isRequired(values.confirmPassword)) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem';
  }

  return errors;
};

/**
 * Create validation function for profile form
 */
export const validateProfileForm = (values) => {
  const errors = {};

  if (!isRequired(values.fullName)) {
    errors.fullName = 'Nome completo é obrigatório';
  } else if (!minLength(values.fullName, 3)) {
    errors.fullName = 'O nome deve ter pelo menos 3 caracteres';
  }

  if (!isRequired(values.birthDate)) {
    errors.birthDate = 'Data de nascimento é obrigatória';
  } else if (!isPastDate(values.birthDate)) {
    errors.birthDate = 'A data de nascimento deve ser no passado';
  } else if (!isMinAge(values.birthDate, 10)) {
    errors.birthDate = 'Idade mínima é 10 anos';
  }

  if (!isRequired(values.phoneNumber)) {
    errors.phoneNumber = 'Telefone é obrigatório';
  } else if (!isValidPhone(values.phoneNumber)) {
    errors.phoneNumber = 'Formato de telefone inválido';
  }

  if (values.height && (values.height < 100 || values.height > 250)) {
    errors.height = 'A altura deve estar entre 100 e 250 cm';
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