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
    const response = await axios.post(`${authRoute}login`,{email,password},{
      withCredentials: true,
    });

    if (!response.data.success) return { error: response.data.message || "Registration failed." };

    setFormData({ phone: "", email: "", password: "" });

    return { success: true, message: "Successfully registered." };

  } catch (error) {
    return {error: error.response.data?.message || "Something went wrong, try again."};
  }
}