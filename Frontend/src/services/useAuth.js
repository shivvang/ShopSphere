import axios from "axios";

const authRoute = "http://localhost:8000/v1/customers/";

export const register = async ({ phone, email, password, setFormData }) => {
  if (!phone || !email || !password) return { error: "All fields are required." };

  if (!/^\d{10}$/.test(phone)) return { error: "Phone number must be exactly 10 digits." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Invalid email format." };

  if (password.length < 6) return { error: "Password must be at least 6 characters long." };

  try {
    const response = await axios.post(`${authRoute}register`, {
      phone:phone,
      email,
      password,
    });

    if (!response.data.success) return { error: response.data.message || "Registration failed." };

    setFormData({ phone: "", email: "", password: "" });

    return { success: true, message: "Successfully registered."};
    
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
    const response = await axios.post(`${authRoute}login`,{email,password},{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "Login failed." };

    setFormData({ phone: "", email: "", password: "" });

    return { success: true, message: "Successfully registered.",customer:response.data.user };

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

    const response = await axios.post(`${authRoute}logout`,{},{withCredentials:true});

    if(!response.data.success) return { error: response.data.message || "logout failed." };

    return { success: true, message: "successfully Logged out"};

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
    const response = await axios.put(`${authRoute}reset-password`,{oldPassword,newPassword},{withCredentials:true});

    if(!response.data.success) return { error: response.data.message || "reset failed." };

    return { success: true, message: "successfully Logged out"};

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


export const GetRecommendations = async(userId)=>{
  try {
    const response = await axios.get(`${authRoute}recommend/${userId}`,{withCredentials:true});

    if(!response.data.success) return { error: response.data.message || "reset failed." };

    return { success: true, products:response.data.recommendations };

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


export const GetOrderedRecommendations = async(userId)=>{
  try {
    const response = await axios.get(`${authRoute}orderedRecommend/${userId}`,{withCredentials:true});

    if(!response.data.success) return { error: response.data.message || "reset failed." };

    return { success: true, products:response.data.recommendations };

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

const notificationRoute = "http://localhost:8000/v1/notifications";

export const markAsRead = async(productId)=>{
  try {
    const response = await axios.get(`${notificationRoute}/read/${productId}`,{withCredentials:true});

    if(!response.data.success) return { error: response.data.message || "Failed to Mark Notification As Read." };

    return { success: true, message: response.data.message };

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

export const findUnReadNotification = async(userId)=>{
  try {

    const response = await axios.get(`${notificationRoute}/unRead/${userId}`);

    if(!response.data.success) return { error: response.data.message || "Failed to Fetch UnRead Notification." };

    return { success: true, products:response.data.recommendations };

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