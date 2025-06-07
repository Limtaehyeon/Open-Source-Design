// utils/majorUtils.js
export const saveSelectedMajor = (major) => {
  sessionStorage.setItem("adminSelectedMajor", major);
};

export const getSelectedMajor = () => {
  return sessionStorage.getItem("adminSelectedMajor");
};

export const clearSelectedMajor = () => {
  sessionStorage.removeItem("adminSelectedMajor");
};
