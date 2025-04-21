import React, { useState } from "react";
import { addToCart, addToWishlist, setOrder } from "../../services/useShopping";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom"

/* eslint-disable react/prop-types */
// eslint-disable-next-line react/display-name
  const ProductCard = React.memo(({ product }) => {

    const [loading,setLoading] = useState(false);

    const navigate = useNavigate(); 

    const handleAction = async (e,actionFn, successMsg, ...params) => {
      e.stopPropagation();
      try {
        setLoading(true);
        const data = await actionFn(...params);
        setLoading(false);
        data.success ? toast.success(successMsg) : toast.error(data.error);
      } catch (error) {
        setLoading(false);
        toast.error(error);
      }
    };
    
    return (
      <div className="border rounded-lg shadow-md p-4 w-full sm:w-64 bg-white" onClick={()=>navigate(`/product/${product._id}`)}>
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
        <button disabled={loading} className="mt-3 bg-[#F5F5F5] text-black w-full py-2 rounded-lg hover:bg-gray-300" onClick={(e)=>handleAction(e,addToWishlist,"successfully added to wishlist",product._id,product.name,product.imageUrl,product.brand,product.finalPrice)}>
          Add to Wishlist
        </button>

      <div className="flex mt-3 gap-2">
        <button onClick={(e)=>handleAction(e,addToCart,"successfully added to Cart",product._id,product.name,product.imageUrl,product.brand,product.finalPrice)} disabled={loading} className="bg-[#FF6F00] text-white w-1/2 py-2 rounded-lg hover:bg-[#e65c00]">
          Add to Cart
        </button>

        <button onClick={(e)=>handleAction(e,setOrder,"successfully Ordered",product._id,product.name,product.imageUrl,product.brand,product.finalPrice)} disabled={loading} className="bg-[#333333] text-white w-1/2 py-2 rounded-lg hover:bg-[#1a1a1a]">
          Buy Now
        </button>
      </div>
    </div>    
    );
  })
  
  export default ProductCard;
  