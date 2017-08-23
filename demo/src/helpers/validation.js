export const isRequired = value => {
  return value && value !== "";
};

export const isInteger = value => {
  return /^\+?(0|[1-9]\d*)$/.test(value) || /^\+?\d+$/.test(value);
};

export const isMinLength = (value, length) => {
  return value.length >= length;
};

export const isMaxLength = (value, length) => {
  return value.length <= length;
};

export const isEmail = value => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

export const matches = (value, match) => {
  return value === match;
};
