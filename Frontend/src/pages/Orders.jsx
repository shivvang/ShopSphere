/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchOrders } from "../services/useProfile";
import {toast} from "react-hot-toast";
import { cancelOrder } from "../services/useShopping";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]  = useState(false);
  const [stateChange, setStateChange] = useState(false);


  async function getOrders() {
    const result = await fetchOrders();

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order list loaded successfully!");
      setOrders(result.orders);
    }
  }
  
    useEffect(() => {
      if(stateChange) return;
      getOrders();
    }, [stateChange]);


    const handleCancelOrder = async (productId) => {
      if (loading) return;
      setLoading(true);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.productId === productId
            ? { ...order, status: "cancelled" }
            : order
        )
      );
  
      const response = await cancelOrder(productId);
  
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Order successfully cancelled");
        setStateChange(true); 
      }
  
      setLoading(false);
    };
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-white mb-4">Your Orders</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderProduct key={`${order.productId}-${order._id}`} order={order} handleCancelOrder={handleCancelOrder} />
          ))
        ) : (
          <p className="text-gray-400">You haven&apos;t placed any orders yet.</p>
        )}
      </div>
    </div>
  )
}

export default Orders;

function OrderProduct({ order ,handleCancelOrder}) {
  const statusColors = {
    shipped: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105">
      <img
        src={order.imageUrl}
        alt={order.name}
        className="w-32 h-32 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-black mt-2">{order.name}</h3>
      <p className="text-gray-600 mt-1">Quantity: {order.quantity}</p>
      <p className="text-orange-600 font-bold text-xl mt-1">₹{order.priceAtPurchase}</p>
      <span
        className={`text-white text-sm px-3 py-1 rounded-full mt-2 ${statusColors[order.status]}`}
      >
        {order.status.toUpperCase()}
      </span>
      <button
        disabled={order.status === "delivered"}
        onClick={() => handleCancelOrder(order.productId)}
        className={`
          px-4 py-2 rounded-lg mt-3 shadow-md transition duration-200
          ${order.status === "delivered"
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400' // Styles for delivered state
            : 'bg-red-500 text-white hover:bg-red-600' // Default styles
          }
        `}
      >
     Cancel Order
    </button>
    </div>
  );
}