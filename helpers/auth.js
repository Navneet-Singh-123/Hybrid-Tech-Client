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
export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split("=")[1];
  return tokenValue;
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

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));
      const { name, email, role, _id } = user;
      let updated = { name, email, role, _id };
      auth = updated;
      localStorage.setItem("user", JSON.stringify(auth));
      next();
    }
  }
};
