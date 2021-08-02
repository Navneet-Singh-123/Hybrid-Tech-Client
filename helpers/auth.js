import cookie from "js-cookie";
import Router from "next/router";

// Set in cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// Remove from cookie
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

// Get from cookie such as stored token
export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

// Set in local storage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove from local storage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// Authenticate user by passing data to cookie and local storage during signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// Access user info from local storage
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  removeLocalStorage("user");
  removeCookie("token");
  Router.push("/login");
};
