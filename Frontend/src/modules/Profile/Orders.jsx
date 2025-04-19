/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchOrders } from "../../services/useProfile";
import {toast} from "react-hot-toast";
import { cancelOrder } from "../../services/useShopping";
import Spinner from "../common/Spinner";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]  = useState(false);

  async function getOrders() {
    const result = await fetchOrders();

    if (result.error) {
      toast.error(result.error);
    } else {
      setOrders(result.orders);
    }
  }
  
    useEffect(() => {
      getOrders();
    }, []);


    const handleCancelOrder = async (productId) => {
      if (loading) return;
      setLoading(true);

      const response = await cancelOrder(productId);
  
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Order successfully cancelled");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.productId === productId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      }
  
      setLoading(false);
    };
  return (
    loading ?(
      <Spinner/>
    ):(
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
  )
}

export default Orders;

function OrderProduct({ order ,handleCancelOrder}) {
  const statusColors = {
    shipped: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  const isDisabled = order.status === "delivered" || order.status === "cancelled";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-[1.03] hover:shadow-2xl duration-300 ease-in-out w-full max-w-sm mx-auto">

    {/* Product Image */}
    <div className="w-full h-48 overflow-hidden rounded-xl mb-4">
      <img
        src={order.imageUrl}
        alt={order.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>

    {/* Product Info */}
    <h3 className="text-xl font-semibold text-gray-800">{order.name}</h3>
    <p className="text-gray-500 text-sm mt-1">{order.brand}</p>
    <p className="text-orange-600 font-extrabold text-2xl mt-2">₹{order.priceAtPurchase}</p>
    <p className="text-gray-600 text-sm mt-1">Qty: <span className="font-medium">{order.quantity}</span></p>

    {/* Status Badge */}
    <span
      className={`mt-3 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm capitalize ${statusColors[order.status]}`}
    >
      {order.status}
    </span>

    {/* Cancel Button */}
    <button
  disabled={isDisabled}
  onClick={() => handleCancelOrder(order.productId)}
  className={`mt-5 w-full py-2 rounded-xl font-semibold transition-all duration-300 ${
    isDisabled
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-red-500 text-white hover:bg-red-600"
  }`}
>
  Cancel Order
</button>
  </div>
  );
}