import {Routes,Route} from "react-router-dom";
import Profile from "../pages/Profile";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import AccountSettings from "../pages/AccountSettings";

function ProfileRoute() {
    return (
      <Routes>
        <Route path="/" element={<Profile />}>
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    );
  }
  
  export default ProfileRoute;