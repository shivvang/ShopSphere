import axios from "axios";

const sellerRoute = "http://localhost:8000/v1/seller";

export const register = async ({ phone, email, password,shopName, setFormData }) => {
  if (!phone || !email || !password || !shopName) return { error: "All fields are required." };

  if (!/^\d{10}$/.test(phone)) return { error: "Phone number must be exactly 10 digits." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Invalid email format." };

  if (password.length < 6) return { error: "Password must be at least 6 characters long." };

  try {
    console.log("at least im here");
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
    return { error: error.response?.data?.message || "Something went wrong, try again." };
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

    return { success: true, message: "Successfully registered." };

  } catch (error) {
    return {error: error.response.data?.message || "Something went wrong, try again."};
  }
}