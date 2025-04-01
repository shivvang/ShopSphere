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

export const getRandomProducts = async(noOfProduct = 5)=>{
  try {
    
    const response = await axios.get(`${productRoute}/randomProducts/${noOfProduct}`,{withCredentials:true});

    if (!response.data.success) return { error: response.data.message || "fetch failed." };

    return { success: true, message: "Successfully fetched.",products: response.data.products };

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


export const getLatestProducts = async()=>{
  try {
    
    const response = await axios.get(`${productRoute}/latestProducts`);

    if (!response.data.success) return { error: response.data.message || "fetch failed." };

    return { success: true, message: "Successfully fetched.",products: response.data.products };

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


export const uploadFileAndGetUrl = async(file)=>{
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`http://localhost:8002/api/products/file/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
  

       if (!response.data.success) return { error: response.data.message || "upload failed." };

       return { success: true, message: "Successfully Uploaded File.",fileUrl: response.data.fileUrl };

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

export const removeImageFromAWS = async(imageUrl)=>{
    try {
        const response = await axios.delete(`${productRoute}/image/remove`,{
            data: { imageUrl: imageUrl }, 
            withCredentials:true,
          });

        if (!response.data.success) return { error: response.data.message || "upload failed." };

       return { success: true, message: "Successfully Removed Uploaded File.",fileUrl: response.data.fileUrl };
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

export const createProduct = async({ name,description,imageUrl,price,discount,category,brand,tags,searchKeywords})=>{
    try {
        const tagsArray = tags.split(",").map(function (value){
            return value.trim();
        });

        const searchKeywordsArray = searchKeywords.split(",").map(function (value){
            return value.trim();
        });

        const response = await axios.post(`${productRoute}/createProduct`,{name,description,imageUrl,price,discount,category,brand,tags:tagsArray,searchKeywords:searchKeywordsArray},{withCredentials:true});

        if (!response.data.success) return { error: response.data.message || "Registration failed." };

    
        const associateProductwithSeller = await axios.post(
            `http://localhost:8002/api/seller/associateProduct/${response.data.product._id}`,{},{
            withCredentials: true,
            }
          );

        return { success: true, message: "Successfully Created Product and Associated with Seller.",product: response.data.product ,seller:associateProductwithSeller.data.seller._id};

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

export const updateProduct = async(productId,formData)=>{
    try {

        const updateData = {}; // Object to hold only updated fields

        if (formData.description !== "") {
          updateData.description = formData.description;
        }
        if (formData.imageUrl !== "") {
          updateData.imageUrl = formData.imageUrl;
        }
        if (formData.price !== "") {
          updateData.price = formData.price;
        }
        if (formData.discount !== "") {
          updateData.discount = formData.discount;
        }
        
        const tagsArray = formData.tags.split(",").map((value) => value.trim());
        if (tagsArray.length > 0 && !(tagsArray.length === 1 && tagsArray[0] === "")) { 
            updateData.tags = tagsArray;
            }
    
            
        const keywordsArray = formData.searchKeywords.split(",").map((value) => value.trim());
        if (keywordsArray.length > 0 && !(keywordsArray.length === 1 && keywordsArray[0] === "")) { 
        updateData.searchKeywords = keywordsArray;
        }
              
        const response = await axios.put(`${productRoute}/updateProduct/${productId}`,updateData,{withCredentials:true});

        return { success: true, message: "Successfully Created Product and Associated with Seller.",product: response.data.product};

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

export const deleteProduct = async(productId)=>{
    try {
        if (!productId) {
          console.error("Product ID is required.");
          return { error: "Product ID is required." };
        }
    
        // Delete the product
        const productDeleteResponse = await axios.delete(
          `${productRoute}/deleteProduct/${productId}`, 
          { withCredentials: true }
        );
    
        // Disassociate the product from sellers
        const disassociateResponse = await axios.delete(
          `http://localhost:8002/api/seller/disassociateProduct/${productId}`,
          { withCredentials: true }
        );
    
        return {
          success: true,
          message: "Product deleted and disassociated successfully.",
          productDeleteResponse: productDeleteResponse.data,
          disassociateResponse: disassociateResponse.data,
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