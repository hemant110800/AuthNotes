import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  getToken,
  update_access_token,
  registerUser,
} from "../utils/http_methods";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );

  const [user, setUser] = useState(() =>
    authToken ? jwtDecode(authToken.access).username : null
  );

  const [userID, setUserID] = useState(() =>
    authToken ? jwtDecode(authToken.access).user_id : null
  );

  const [loading, setLoading] = useState(true);

  /* ---------------- LOGIN ---------------- */
  const loginHandler = async (userData) => {
    try {
      const resp = await getToken(userData);

      if (resp.status === 200) {
        setAuthToken(resp.data);
        setUser(jwtDecode(resp.data.access).username);
        setUserID(jwtDecode(resp.data.access).user_id);
        localStorage.setItem("authToken", JSON.stringify(resp.data));
      }

      return resp;
    } catch (error) {
      return error?.response?.data?.detail || "Login failed";
    }
  };

  /* ---------------- REGISTER ---------------- */
  const registerHandler = async (userData) => {
    try {
      const resp = await registerUser(userData);

      if (resp.status === 201) {
        setAuthToken(resp.data.token);
        setUser(resp.data.username);
        setUserID(jwtDecode(resp.data.token.access).user_id);
        localStorage.setItem("authToken", JSON.stringify(resp.data.token));
      }

      return resp;
    } catch (error) {
      return (
        error?.response?.data?.error ||
        error?.response?.data?.username ||
        "Registration failed"
      );
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logoutUser = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setUserID(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  /* ---------------- TOKEN REFRESH ---------------- */
  const updateToken = useCallback(
    async (refreshToken) => {
      try {
        const resp = await update_access_token(refreshToken);

        if (resp.status === 200) {
          setAuthToken(resp.data);
          setUser(jwtDecode(resp.data.access).username);
          setUserID(jwtDecode(resp.data.access).user_id);
          localStorage.setItem("authToken", JSON.stringify(resp.data));
        }
      } catch (error) {
        logoutUser();
      } finally {
        if (loading) setLoading(false);
      }
    },
    [logoutUser, loading]
  );

  /* ---------------- AUTO REFRESH EFFECT ---------------- */
  useEffect(() => {
    if (loading && authToken) {
      updateToken({ refresh: authToken.refresh });
    }

    const interval = setInterval(() => {
      if (authToken) {
        updateToken({ refresh: authToken.refresh });
      }
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [authToken, loading, updateToken]);

  const contextData = {
    user,
    userID,
    authToken,
    loginHandler,
    logoutHandler: logoutUser,
    registerHandler,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
