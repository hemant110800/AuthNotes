import axios from "axios";
import React, { createContext } from "react";
import { useState, useEffect } from "react";
import { getToken, update_access_token, registerUser } from "../utils/http_methods";
import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  console.log(localStorage.getItem("authToken"));
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null
  );

  const [loading, setLoading] = useState(true);
  // const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || null);
  
  const [user, setUser] = useState(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(JSON.parse(localStorage.getItem("authToken")).access).username
      : null
  );
  const [userID, setUserID] = useState(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(JSON.parse(localStorage.getItem("authToken")).access).user_id
      : null
  );

  const loginHandler = async (userData) => {
    try {
      const resp = await getToken(userData);
      if (resp.status === 200) {
        // console.log(resp, resp.data.access);
        setAuthToken(resp.data);
        console.log(jwtDecode(resp.data.access));
        setUser(jwtDecode(resp.data.access).username);
        setUserID(jwtDecode(resp.data.access).user_id);
        localStorage.setItem("authToken", JSON.stringify(resp.data));
      }
      return resp;
    } catch (error) {
      if (error.response) {
        // The request was made and server responded with a status code not in 2xx
        console.error("Backend error:", error.response.data); // 👈 this has your backend's message

        var err_msg = error.response.data.detail || "Something went wrong.";
        // alert(err_msg);
        return err_msg;
      } else if (error.request) {
        // The request was made but no response
        console.error("No response:", error.request);
      } else {
        // Something else happened
        console.error("Axios error:", error.message);
      }
    }
  };

  const registerHandler = async (userData) => {
    try {
      const resp = await registerUser(userData);
      if (resp.status === 201) {
        console.log(resp, resp.data.token);
        setAuthToken(resp.data.token);
        console.log(jwtDecode(resp.data.token.access), resp.data.username);
        setUser(resp.data.username);
        setUserID(jwtDecode(resp.data.token.access).user_id);
        localStorage.setItem("authToken", JSON.stringify(resp.data.token));
      }
      return resp;
    } catch (error) {
      if (error.response) {
        // The request was made and server responded with a status code not in 2xx
        console.error("Backend error:", error.response.data); // 👈 this has your backend's message

        var err_msg = error.response.data.error || error.response.data.username || "Something went wrong.";
        // alert(err_msg);
        return err_msg;
      } else if (error.request) {
        // The request was made but no response
        console.error("No response:", error.request);
      } else {
        // Something else happened
        console.error("Axios error:", error.message);
      }
    }
  };

  const updateToken = async (refreshToken) => {
    try {
      console.log("Updating the Token!");
      const resp = await update_access_token(refreshToken);
      if (resp.status === 200) {
        console.log(resp, resp.data.access);
        setAuthToken(resp.data);
        console.log(jwtDecode(resp.data.access));
        setUser(jwtDecode(resp.data.access).username);
        setUserID(jwtDecode(resp.data.access).user_id);
        localStorage.setItem("authToken", JSON.stringify(resp.data));
        
        if(loading){
          setLoading(false);
        }

      }
    } catch (error) {
        
        logoutUser();

      if (error.response) {
        // The request was made and server responded with a status code not in 2xx
        console.error("Backend error:", error.response.data); // 👈 this has your backend's message

        var err_msg = error.response.data.detail || "Something went wrong.";
        // alert(err_msg);
      } else if (error.request) {
        // The request was made but no response
        console.error("No response:", error.request);
      } else {
        // Something else happened
        console.error("Axios error:", error.message);
      }
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    setUserID(null);
    localStorage.removeItem("authToken");
    redirect("/login");
  };

  useEffect(() => {
    let fourMinutes = 3*60*1000;
    
    if(loading && authToken){
      updateToken({"refresh":authToken?.refresh})
    }

    let interval = setInterval(() => {
        if(authToken){
            console.log(authToken, authToken.refresh)
            updateToken({"refresh":authToken.refresh});
        }
    }, fourMinutes);

    return () => {
      clearInterval(interval);
    };
  }, [authToken, loading]);

  let contextData = {
    user: user,
    userID: userID,
    authToken:authToken,
    loginHandler: loginHandler,
    logoutHandler: logoutUser,
    registerHandler: registerHandler
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
