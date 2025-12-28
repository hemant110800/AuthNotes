import NavigationBar from "./Navigation";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const RouterWrapper = () => {
  return (
    <div>
      <AuthProvider>
        <NavigationBar></NavigationBar>
        <div className="m-auto p-4">
          <Outlet></Outlet>
        </div>
      </AuthProvider>
    </div>
  );
};

export default RouterWrapper;
