import axios from "axios";

const profileRoute = "http://localhost:8000/v1/customers";

export const fetchWishlist = async () => {
    try {
        const response = await axios.get(`${profileRoute}/wishlist`,{
            withCredentials: true
        });
        
        if (!response.data.success) {
            return { error: response.data.message || "Fetching wishlist failed." };
        }

        return { success: true, wishlist: response.data.wishlist };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
};
  
  
  export const fetchCart  = async()=>{
    try {
        const response = await axios.get(`${profileRoute}/cart`,{
            withCredentials: true
        });

        if (!response.data.success) return { error: response.data.message || "fetching  cart." };

        return { success: true, cart: response.data.cart };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
  }


  export const fetchOrders  = async()=>{
    try {

        const response = await axios.get(`${profileRoute}/orders`,{
            withCredentials: true
        });

        if (!response.data.success) return { error: response.data.message || "fetching  orders." };

        return { success: true, orders: response.data.orders };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
  }