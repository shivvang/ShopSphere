import axios from "axios";

const sellerRoute = "http://localhost:8000/v1/seller";

export const register = async ({ phone, email, password,shopName, setFormData }) => {
  if (!phone || !email || !password || !shopName) return { error: "All fields are required." };

  if (!/^\d{10}$/.test(phone)) return { error: "Phone number must be exactly 10 digits." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Invalid email format." };

  if (password.length < 6) return { error: "Password must be at least 6 characters long." };

  try {
    const response = await axios.post(`${sellerRoute}/register`, {
      phone:phone,
      email,
      password,
      shopName
    });

    if (!response.data.success) return { error: response.data.message || "Registration failed." };

    setFormData({ phone: "", email: "", password: "" ,shopName: "" });

    return { success: true, message: "Successfully registered." };
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
};


export const login = async({email,password,setFormData})=>{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
  if (!emailRegex.test(email)) return { error: "Invalid email format." };

  if (password.length < 6) return { error: "Password must be at least 6 characters long." };

  try {
    const response = await axios.post(`${sellerRoute}/login`,{email,password},{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "Registration failed." };

    setFormData({ phone: "", email: "", password: "" });

    return { success: true, message: "Successfully registered." ,sellerProfile:response.data.user};

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


export const getSellerProducts = async()=>{
    try {
      const response = await axios.post(`${sellerRoute}/my-products`,{},{
        withCredentials: true,
      });

      if (!response.data.success) {
        return { error: response.data.message || "fetching products failed." };
      }

      return {
        success: true,
        message: "Successfully fetched Products.",
        products: response.data.products,
      };

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

export const logout = async()=>{
  try {
    const response = await axios.post(`${sellerRoute}/logout`,{},{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "logout failed." };

    return { success: true, message: "Successfully logged out." };
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

export const resetPassword = async(oldPassword,newPassword)=>{
  try {
    const response = await axios.post(`${sellerRoute}/reset-password`,{oldPassword,newPassword},{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "reset password failed." };

    return { success: true, message: "Successfully reset." };

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

export const deleteSeller = async()=>{
  try {
    const response = await axios.delete(`${sellerRoute}/delete`,{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "reset password failed." };

    return { success: true, message: "Successfully reset." };

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

export const refreshAccessToken = async()=>{
  try {
    const response = await axios.post(`${sellerRoute}/token`,{}, {
      withCredentials: true,
    });

    if (!response.data.success) return { error: true };

    return { success: true, message: "Successfully  Reset." };

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