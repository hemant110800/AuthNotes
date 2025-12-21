import React, { Component, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({children}) {

  const auth = useContext(AuthContext);

  const isAuth = auth.user != null ? true: false;
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
