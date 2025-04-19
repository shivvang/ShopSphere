import { useState } from "react";
import { addToCart, addToWishlist, setOrder } from "../../services/useShopping";
import {toast} from "react-hot-toast";

/* eslint-disable react/prop-types */
function ProductCard({ product }) {
    const [loading,setLoading] = useState(false);

    const handleAddToWishlist = async(productId,name,imageUrl,brand,price)=>{
       
      setLoading(true);
      const data = await addToWishlist(productId,name,imageUrl,brand,price);  

      if(data.success){
        setLoading(false)
        toast.success("successfully added to wishlist");
      }else{
        setLoading(false)
        toast.error(data.error);
      }
    }

    
    
    const handleAddToCart = async(productId,name,imageUrl,brand,price)=>{
       setLoading(true);

       const data = await addToCart(productId,name,imageUrl,brand,price);  

      if(data.success){
        setLoading(false)
        toast.success("successfully added to Cart");
      }else{
        setLoading(false)
        toast.error(data.error);
      }
    }

    const handleBuyNow = async(productId,name,imageUrl,brand,priceAtPurchase)=>{
      setLoading(true);

      const data = await setOrder(productId,name,imageUrl,brand,priceAtPurchase);

      if(data.success){
        setLoading(false)
        toast.success("successfully Ordered");
      }else{
        setLoading(false)
        toast.error(data.error);
      }
    }

    return (
      <div className="border rounded-lg shadow-md p-4 w-full sm:w-64 bg-white">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
    
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
    
      <p className="text-sm text-gray-500">Brand: {product.brand}</p>
    
      <div className="mt-2">
        {product.discount > 0 ? (
          <p className="text-red-500 font-bold">
          ₹{product.finalPrice.toFixed(2)}
            <span className="text-gray-500 line-through text-sm ml-2">
            ₹{product.price.toFixed(2)}
            </span>
          </p>
        ) : (
          <p className="font-bold"> ₹{product.price.toFixed(2)}</p>
        )}
      </div>
        <button disabled={loading} className="mt-3 bg-[#F5F5F5] text-black w-full py-2 rounded-lg hover:bg-gray-300" onClick={()=>handleAddToWishlist(product._id,product.name,product.imageUrl,product.brand,product.finalPrice)}>
          Add to Wishlist
        </button>

      <div className="flex mt-3 gap-2">
       
        <button onClick={()=>handleAddToCart(product._id,product.name,product.imageUrl,product.brand,product.finalPrice)} disabled={loading} className="bg-[#FF6F00] text-white w-1/2 py-2 rounded-lg hover:bg-[#e65c00]">
          Add to Cart
        </button>

        <button onClick={()=>handleBuyNow(product._id,product.name,product.imageUrl,product.brand,product.finalPrice)} disabled={loading} className="bg-[#333333] text-white w-1/2 py-2 rounded-lg hover:bg-[#1a1a1a]">
          Buy Now
        </button>
      </div>
    </div>    
    );
  }
  
  export default ProductCard;
  