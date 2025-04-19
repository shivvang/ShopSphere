import {Routes,Route, Navigate} from "react-router-dom";
import Profile from "../pages/Profile";
import Wishlist from "../modules/Profile/Wishlist";
import Cart from "../modules/Profile/Cart";
import Orders from "../modules/Profile/Orders";
import AccountSettings from "../modules/Profile/AccountSettings";

function ProfileRoute() {
    return (
      <Routes>
        <Route path="/" element={<Profile />}>
          <Route index element={<Navigate to="settings" replace />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    );
  }
  
  export default ProfileRoute;