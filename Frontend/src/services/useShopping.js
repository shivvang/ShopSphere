import axios from "axios";

const wishlistRoute = "http://localhost:8000/v1/wishlist";

//wishlist
export const addToWishlist = async(productId,name,imageUrl,brand,price)=>{
    try {
        const response = await axios.post(`${wishlistRoute}/add/${productId}`,{name,imageUrl,brand,price},{withCredentials:true});

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


const CartRoute = "http://localhost:8000/v1/cart";


export const addToCart = async (productId,name,imageUrl,brand,price)=>{
  try {
    const response = await axios.post(`${CartRoute}/add/${productId}`,{name,imageUrl,brand,price},{withCredentials:true});

        if (!response.data.success) return { error: response.data.message || "add to cart failed." };

        return { success: true, message: "Successfully added to Cart." };
        
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

export const removeFromCart = async(productId)=>{
  try {
    const response = await axios.delete(`${CartRoute}/remove/${productId}`,{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "remove from cart failed." };

    return { success: true, message: "Successfully removed from Cart." };

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

export const clearCart = async()=>{
  try {
    const response = await axios.delete(`${CartRoute}/clear`,{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "remove from cart failed." };

    return { success: true, message: "Successfully removed from Cart." };
    
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

const orderRoute = "http://localhost:8000/v1/orders";

export const setOrder = async(productId,name,imageUrl,brand,priceAtPurchase)=>{
  try {
    const response = await axios.post(`${orderRoute}/add/${productId}`,{name,imageUrl,brand,priceAtPurchase}, {withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "failed to set order." };

    return { success: true, message: "Successfully ordered." };

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

export const cancelOrder = async(productId)=>{
  try {
    const response = await axios.delete(`${orderRoute}/remove/${productId}`, {withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "failed to set order." };

    return { success: true, message: "Successfully ordered." };

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

export const checkoutOrder = async(cart)=>{
  try {
    const response = await axios.post(`${orderRoute}/order/checkout`,{arrayOfProducts:cart},{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "failed to set order." };

    return { success: true, message: "Successfully ordered." };

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