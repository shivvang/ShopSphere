import axios from "axios";

const productRoute = "http://localhost:8000/v1/products";


export const searchProducts = async({searchQuery,category,brand,discount,price,rating,sortOrder})=>{
    try {
        const response = await axios.post(`${productRoute}/searchProducts`,{
            searchQuery:searchQuery,
            category:category,
            brand:brand,
            discount:discount,
            price:price,
            rating:rating,
            sortOrder:sortOrder
        },{
            withCredentials:true
        });

        if (!response.data.success) return { error: response.data.message || "Registration failed." };

        return { success: true, message: "Successfully Searched.",products: response.data.products };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
}