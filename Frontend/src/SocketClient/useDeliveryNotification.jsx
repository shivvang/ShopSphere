import { useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import toast from "react-hot-toast";

const useDeliveryNotification = () => {
  const { currentCustomer } = useSelector((state) => state.customer);

  useEffect(() => {
    if (!currentCustomer) return;
    
    const socket = io("http://localhost:3000", {
      withCredentials: true,
      query: { userId: currentCustomer.id }, 
    });

    socket.on("deliveryUpdate", (data) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
        >
          <img
            src={data.imageUrl}
            alt={data.productName}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="ml-4">
            <p className="font-semibold text-green-700">{data.message}</p>
            <p className="text-sm text-gray-700">Product ID: {data.productId}</p>
            <p className="text-sm">Quantity: {data.quantity}</p>
            <p className="text-sm">Price: ₹{data.priceAtPurchase}</p>
          </div>
        </div>
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentCustomer]);
};

export default useDeliveryNotification;
