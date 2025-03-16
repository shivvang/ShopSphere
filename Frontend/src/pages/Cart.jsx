/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchCart } from "../services/useProfile";
import toast from "react-hot-toast";
import Spinner from "../modules/common/Spinner";
import { clearCart, removeFromCart } from "../services/useShopping";

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading,setLoading] = useState(false);

    async function getCart() {
      const result = await fetchCart();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("fetched Cart Item's");
        setCart(result.cart);
      }
    }
  
    useEffect(() => {
      getCart();
    }, []);
  
    const handleRemoveFromCart = async(productId)=>{

      if(loading)return;

      setLoading(true);

      setCart((prev)=>prev.filter((item)=>item.productId !== productId))

      const response = await removeFromCart(productId);

         if(response.success){
          toast.success("Removed from Cart");
          setTimeout(async () => {
                  const updatedCart = await getCart();
                  setCart(updatedCart.cart);
                }, 500); 

         }else{
          toast.error(response.error);
         }
         setLoading(false);
      }

      const handleClearCart = async()=>{
        if(loading)return;

        setLoading(true);

        setCart([]);

        const response = await clearCart();

        if(response.success){
          toast.success("Cleared Cart");
           setTimeout(async () => {
                  const updatedCart = await getCart();
                  setCart(updatedCart.cart);
                }, 500);

        }else{
          toast.error(response.error);
        }
        setLoading(false);
      }

  return ( 
    <>
    {loading && <Spinner/>}
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
                <CartProduct key={item.productId} product={item} handleRemoveFromCart={handleRemoveFromCart } />
            ))
        ) : (
            <p className="text-gray-400">Your cart is empty</p>
        )}
     </div>
   </div>
   </>
  )
}

export default Cart


function CartProduct({ product ,handleRemoveFromCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-black mt-2">{product.name}</h3>
      <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>
      <p className="text-gray-600 mt-1">Quantity: {product.quantity}</p>
      <div className="flex space-x-2 mt-3">
        <button className="bg-[#FF6F00] text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition" onClick={()=>handleRemoveFromCart(product.productId)}>
          Remove
        </button>
        <button className="bg-black text-white px-3 py-2 rounded-lg border border-gray-400 hover:bg-gray-900 transition">
          Checkout
        </button>
      </div>
    </div>
  );
}