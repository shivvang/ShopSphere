import axios from "axios";

const wishlistRoute = "http://localhost:8000/v1/wishlist";

//wishlist
export const addToWishlist = async(productId,name,imageUrl,price)=>{
    try {
        const response = await axios.post(`${wishlistRoute}/add/${productId}`,{name,imageUrl,price},{withCredentials:true});

        if (!response.data.success) return { error: response.data.message || "add to wishlist failed." };

        return { success: true, message: "Successfully added to wishlist." };

    } catch (error) {
        if (error.response) {
            if (error.response.status >= 400 && error.response.status < 500) {
              // Controlled backend errors 
              return { error: error.response.data.message || "Request failed. Please try again." };
            }
          }
          // Unexpected errors
          return { error: "Something went wrong. Please try again." };
    }
}

export const removeWishlistItem = async(productId)=>{
  try {
    const response = await axios.delete(`${wishlistRoute}/remove/${productId}`,{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "add to wishlist failed." };

    return { success: true, message: "Successfully added to wishlist." };

} catch (error) {
    if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          // Controlled backend errors 
          return { error: error.response.data.message || "Request failed. Please try again." };
        }
      }
      // Unexpected errors
      return { error: "Something went wrong. Please try again." };
}
}

export const clearWishlistItem = async()=>{
  try {
    const response = await axios.delete(`${wishlistRoute}/clear`,{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "add to wishlist failed." };

    return { success: true, message: "Successfully added to wishlist." };

} catch (error) {
    if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          // Controlled backend errors 
          return { error: error.response.data.message || "Request failed. Please try again." };
        }
      }
      // Unexpected errors
      return { error: "Something went wrong. Please try again." };
}
}