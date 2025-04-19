/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchCart } from "../../services/useProfile";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { checkoutOrder, clearCart, removeFromCart, setOrder } from "../../services/useShopping";

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading,setLoading] = useState(false);

    async function getCart() {
      const result = await fetchCart();

      if (result.error) {
        toast.error(result.error);
      } else {
        setCart(result.cart);
      }
    }
  
    useEffect(() => {
      getCart();
    }, []);
  
    const handleRemoveFromCart = async(productId)=>{
      if(loading)return;

      setLoading(true);

      const response = await removeFromCart(productId);

         if(response.success){
          toast.success("Removed from Cart");
          setCart((prev)=>prev.filter((item)=>item.productId !== productId))
         }else{
          toast.error(response.error);
         }
         setLoading(false);
      }

      const handleClearCart = async()=>{
        if(loading)return;

        setLoading(true);
        
        const response = await clearCart();

        if(response.success){
          toast.success("Cleared Cart");
          setCart([]);
        }else{
          toast.error(response.error);
        }
        setLoading(false);
      } 
      
      const handleOrderNow = async (productId, name, imageUrl,bramd, priceAtPurchase) => {
        if (loading) return;
      
        setLoading(true);
      
        setCart((prev) => prev.filter((item) => item.productId !== productId));
      
        try {
          const [removeResponse, orderResponse] = await Promise.all([
            removeFromCart(productId),
            setOrder(productId, name, imageUrl, bramd,priceAtPurchase)
          ]);
      
          if (orderResponse.success) {
            toast.success("Ordered successfully");
          } else {
            toast.error(orderResponse.error || "Failed to place order");
          }
      
          if (!removeResponse.success) {
            toast.error(removeResponse.error || "Failed to sync cart with backend");
          }
        } finally {
          setLoading(false);
        }
      };
      
      const handleCheckOut = async (cart) => {
        if (loading) return;
    
        setLoading(true);

        setCart([]);
        
        try {
            const [removeResponse, orderResponse] = await Promise.all([
                clearCart(),
                checkoutOrder(cart)
            ]);
    
            if (orderResponse.success) {
                toast.success("Successful Order");
                if (orderResponse.warning) toast.error(orderResponse.warning);
    
                if (removeResponse.success) {
                    toast.success("Cart cleared");
                } else {
                    toast.error("Failed to clear cart");
                }
            } else {
                toast.error(orderResponse.error);
            }
        } catch (error) {
            toast.error("An error occurred during checkout");
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    };

    
  return ( 
    loading ? (<Spinner/>):(
      <>
    <div className="min-h-screen bg-black text-white p-6">
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-4">Shopping Cart</h2>
        {cart.length > 0 && (
            <button
                onClick={()=>handleClearCart()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
                Clear All
            </button>
        )}
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart.length > 0 ? (
            cart.map((item) => (
                <CartProduct key={item.productId} product={item} handleRemoveFromCart={handleRemoveFromCart } handleOrderNow={handleOrderNow} />
            ))
        ) : (
            <p className="text-gray-400">Your cart is empty</p>
        )}
     </div>
   </div>
   {cart.length > 1 && (
      <div className="fixed bottom-0 left-0 w-full bg-black py-3 shadow-lg flex justify-center">
        <button
          onClick={() =>handleCheckOut(cart) }
          className="bg-[#FF6F00] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
        >
        {  `Proceed to Buy (${cart.length} items)`}
        </button>
      </div>
    )}
    </>
  )
  )
}

export default Cart


function CartProduct({ product ,handleRemoveFromCart,handleOrderNow }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-[1.03] hover:shadow-2xl duration-300 ease-in-out w-full max-w-sm mx-auto">
      
    <div className="w-full h-48 overflow-hidden rounded-xl mb-4">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>

    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
    <p className="text-gray-500 text-sm mt-1">{product.brand}</p>
    <p className="text-orange-600 font-extrabold text-2xl mt-2">₹{product.price}</p>
    <p className="text-gray-600 text-sm mt-1">Qty: <span className="font-medium">{product.quantity}</span></p>

    <div className="flex flex-col sm:flex-row gap-3 mt-5 w-full">
      <button
        onClick={() => handleRemoveFromCart(product.productId)}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all duration-300"
      >
        Remove
      </button>
      <button
        onClick={() =>
          handleOrderNow(
            product.productId,
            product.name,
            product.imageUrl,
            product.brand,
            product.price
          )
        }
        className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-xl font-semibold border border-gray-400 hover:from-gray-900 hover:to-black transition-all duration-300"
      >
        Order Now
      </button>
    </div>
  </div>
  );
}