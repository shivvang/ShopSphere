/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchOrders } from "../services/useProfile";


function Orders() {
  const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      async function getCart() {
        const result = await fetchOrders();
  
        if (result.error) {
          setError(result.error);
        } else {
          setOrders(result.orders);
        }
      }
  
      getCart();
    }, []);
  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-white mb-4">Your Orders</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderProduct key={order.productId} order={order} />
          ))
        ) : (
          <p className="text-gray-400">You haven&apos;t placed any orders yet.</p>
        )}
      </div>
    </div>
  )
}

export default Orders;

function OrderProduct({ order }) {
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
    </div>
  );
}