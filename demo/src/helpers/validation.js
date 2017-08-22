export const isRequired = (value) => {
  return (value && value !== '');
}

export const isInteger = (value) => {
  return /^\+?(0|[1-9]\d*)$/.test(value) || /^\+?\d+$/.test(value);
}

export const isMinLength = (value, length) => {
  return value.length >= length;
}

export const isMaxLength = (value, length) => {
  return value.length <= length;
}
