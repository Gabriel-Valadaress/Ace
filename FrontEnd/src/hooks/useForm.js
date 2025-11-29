import { useState, useCallback } from 'react';

/**
 * Custom hook for handling form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function (optional)
 */
export function useForm(initialValues = {}, validate = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files[0];
    } else {
      newValue = value;
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  /**
   * Handle input blur (mark as touched)
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate single field on blur
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    }
  }, [values, validate]);

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Set multiple errors (from API response)
   */
  const setApiErrors = useCallback((apiErrors) => {
    if (Array.isArray(apiErrors)) {
      // Convert array of error strings to object
      const errorObj = {};
      apiErrors.forEach((err) => {
        // Try to match error to field
        const lowerErr = err.toLowerCase();
        if (lowerErr.includes('email')) errorObj.email = err;
        else if (lowerErr.includes('password')) errorObj.password = err;
        else if (lowerErr.includes('cpf')) errorObj.cpf = err;
        else if (lowerErr.includes('phone')) errorObj.phoneNumber = err;
        else if (lowerErr.includes('name')) errorObj.fullName = err;
        else errorObj.general = err;
      });
      setErrors(errorObj);
    } else if (typeof apiErrors === 'object') {
      setErrors(apiErrors);
    }
  }, []);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Check if field has error and is touched
   */
  const getFieldError = useCallback((name) => {
    return touched[name] && errors[name] ? errors[name] : '';
  }, [touched, errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setApiErrors,
    validateForm,
    resetForm,
    getFieldError,
  };
}

export default useForm;