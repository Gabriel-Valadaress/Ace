import { useState, useCallback } from 'react';

export function useForm(initialValues = {}, validate = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

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

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setApiErrors = useCallback((apiErrors) => {
    if (Array.isArray(apiErrors)) {
      const errorObj = {};
      apiErrors.forEach((err) => {
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

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();

      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

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

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

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