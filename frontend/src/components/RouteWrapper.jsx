import NavigationBar from "./Navigation";
import { Outlet } from "react-router-dom";

const RouterWrapper = ()=>{


    return(
        <div>
            <NavigationBar></NavigationBar>
            <div className="m-auto p-4">
            <Outlet></Outlet>
            </div>
        </div>
    )
}

export default RouterWrapper;