import {Navigate,Outlet} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute  = ()=>{
    const { currentSeller } = useSelector((state) => state.seller);
    return currentSeller ? <Outlet/> : <Navigate to="/seller/login" replace/>
}

export default PrivateRoute;