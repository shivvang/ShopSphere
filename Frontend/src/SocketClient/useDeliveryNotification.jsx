import { useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { findUnReadNotification, markAsRead } from "../services/useAuth";

let socket;

const useDeliveryNotification = () => {
  const { currentCustomer } = useSelector((state) => state.customer);

  //Display toast with a delay
  const showToastWithDelay = async (notifications) => {
    for (let i = 0; i < notifications.length; i++) {
      const data = notifications[i];

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

      await markAsRead(data.productId); // Mark as read

      await new Promise((res) => setTimeout(res, 3000)); // Wait 3 seconds before showing next
    }
  };

  useEffect(() => {
    if (!currentCustomer?.id) return;

    const fetchUnread = async () => {
      try {
        const response = await findUnReadNotification(currentCustomer.id);

        if (response?.message) {
          toast.success(response.message);
        } else if (response?.notifications?.length > 0) {
          await showToastWithDelay(response.notifications);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications.");
        console.error("Notification error:", error);
      }
    };

    fetchUnread();
  }, [currentCustomer]);

  useEffect(() => {
    if (!currentCustomer) return;

    socket = io("http://localhost:3000", {
      withCredentials: true,
      query: { userId: currentCustomer.id },
    });

    socket.on("deliveryUpdate", async (data) => {
      await showToastWithDelay([data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentCustomer]);
};

export default useDeliveryNotification;
