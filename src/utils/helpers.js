
// Utility functions for the application

export const formatSearchQuery = (query) => {
  return query.trim().toLowerCase();
};

export const validateSearchInput = (query) => {
  return query && query.trim().length > 0;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
