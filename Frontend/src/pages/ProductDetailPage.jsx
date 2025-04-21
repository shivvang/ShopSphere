import { useNavigate,useParams } from "react-router-dom";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useEffect, useState ,useRef, useCallback } from "react";
import { getProduct } from "../services/useProduct";
import {toast} from "react-hot-toast"
import Spinner from "../modules/common/Spinner";
import { addToCart, addToWishlist } from "../services/useShopping";

  export default function ProductPage() {

    const quantityInputRef = useRef(null);

    const navigate = useNavigate();

    const ProductId = useParams().ProductId;

    const [product, setProduct] = useState({});

    const [loading,setLoading] = useState(false);
    
    useEffect(()=>{

      const fetchProduct = async()=>{
        try {

          setLoading(true);

          const response = await getProduct(ProductId);

          if(response.success) setProduct(response.product);

          else toast.error(response.error); 

        } finally{
          setLoading(false);
        }
      }
      fetchProduct();
    },[ProductId])
  
    const discountedPrice = product.price - (product.price * product.discount) / 100;

    const handleAddToWishlist = useCallback( async()=>{
      try{
        setLoading(true);

        const response = await addToWishlist(ProductId,product.name,product.imageUrl,product.brand,product.finalPrice);

        if(response.success) toast.success(response.message);
        else toast.error(response.error);

      }finally{
        setLoading(false);
      }
    },[ProductId,product])

    const handleAddToCart =  useCallback(async()=>{

      try{
        setLoading(true);

        const response = await addToCart(ProductId,product.name,product.imageUrl,product.brand,product.finalPrice,quantityInputRef.current.value);

        if(response.success) toast.success(response.message);
        else toast.error(response.error);

      }finally{
        setLoading(false);
      }
    },[ProductId,product])


    if(loading) return <Spinner/>

   
    return (
      <div className="min-h-screen bg-white p-4 sm:p-8 text-black">
     
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#FF6F00] text-white hover:bg-black px-4 py-2 rounded-full transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gray-100 p-6 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-contain h-[300px] sm:h-[400px] w-full rounded-xl"
          />
        </div>
    
   
        <div className="p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FF6F00]">{product.name}</h1>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
    
          
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Category:</strong> {product.category}</p>
            </div>
    
           
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <span className="text-2xl font-semibold text-black">
                ₹{discountedPrice}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-gray-500 line-through text-sm">₹{product.price}</span>
                  <span className="text-green-600 font-medium text-sm">
                    ({product.discount}% OFF)
                  </span>
                </>
              )}
            </div>
    
           
            <div className="flex flex-wrap gap-2 mt-6 mb-10">
              {product.tags && product.tags.length > 0 && product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#FF6F00] text-white text-xs font-medium px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
    
            
            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min={1}
                max={product.quantity}
                defaultValue={1}
                ref={quantityInputRef}
                className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
              />
            </div>
          </div>
    
          <div className="flex flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-[#FF6F00] transition" onClick={handleAddToCart}>
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button disabled={loading} className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded-full hover:bg-[#FF6F00] hover:text-white transition" onClick={handleAddToWishlist}>
              <Heart size={16} /> Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }
  

