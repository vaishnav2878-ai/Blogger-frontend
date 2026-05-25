export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem("token");

export const saveAuth = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("authChange"));
};

export const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChange"));
};