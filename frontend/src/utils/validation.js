export const validateRequired = (value, message) => {
  if (!String(value || '').trim()) {
    return message;
  }
  return '';
};

export const validateEmailStrict = (value, message) => {
  if (!String(value || '').trim()) {
    return message;
  }
  const isValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value).trim());
  return isValid ? '' : message;
};
