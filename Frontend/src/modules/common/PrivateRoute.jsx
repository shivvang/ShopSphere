import {Outlet,Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = ()=>{
const {currentCustomer} = useSelector((state)=>state.customer);
return currentCustomer ? <Outlet/> : <Navigate to="/auth/login" replace/>
}

export default PrivateRoute;