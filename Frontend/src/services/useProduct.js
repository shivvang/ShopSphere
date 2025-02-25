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

export const uploadFileAndGetUrl = async(file)=>{
    try {

        const formData = new FormData();

        formData.append('file', file);

       const response = await axios.post(`http://localhost:8002/api/products/file/upload`,formData,{headers: {
          'Content-Type': 'multipart/form-data', 
        },}); 

       if (!response.data.success) return { error: response.data.message || "upload failed." };

       return { success: true, message: "Successfully Uploaded File.",fileUrl: response.data.fileUrl };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
}

export const removeImageFromAWS = async(imageUrl)=>{
    try {
        const response = await axios.delete(`http://localhost:8002/api/products/image/remove`,{
            data: { imageUrl: imageUrl }, 
          });

        if (!response.data.success) return { error: response.data.message || "upload failed." };

       return { success: true, message: "Successfully Removed Uploaded File.",fileUrl: response.data.fileUrl };
    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
}

export const createProduct = async({ name,description,imageUrl,price,discount,category,brand,tags,searchKeywords})=>{
    try {
        const tagsArray = tags.split(",").map(function (value){
            return value.trim();
        });

        const searchKeywordsArray = searchKeywords.split(",").map(function (value){
            return value.trim();
        });

        console.log("switching position",tagsArray,searchKeywordsArray);

        imageUrl ="https://example.com/headphones.jpg";

        const response = await axios.post(`http://localhost:8002/api/products/createProduct`,{name,description,imageUrl,price,discount,category,brand,tags:tagsArray,searchKeywords:searchKeywordsArray});
        if (!response.data.success) return { error: response.data.message || "Registration failed." };
        return { success: true, message: "Successfully Created Product.",product: response.data.product };

    } catch (error) {
        return { error: error.response?.data?.message || "Something went wrong, try again." };
    }
}