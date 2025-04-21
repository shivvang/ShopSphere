import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { findUnReadNotification, markAsRead, markBulkAsRead } from "../services/useAuth";

const useDeliveryNotification = () => {
  const { currentCustomer } = useSelector((state) => state.customer);
  const socketRef = useRef(null);

  const renderSingleToast = (data, t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
    >
      <img
        src={data.imageUrl || "/placeholder.png"}
        alt={data.productName || "Product Image"}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="ml-4">
        <p className="font-semibold text-green-700">{data.message}</p>
        <p className="text-sm text-gray-700">Product ID: {data.productId}</p>
        <p className="text-sm text-gray-700">Name: {data.name}</p>
        <p className="text-sm text-gray-700">Brand: {data.brand}</p>
        <p className="text-sm">Quantity: {data.quantity}</p>
        <p className="text-sm">Price: ₹{data.priceAtPurchase}</p>
      </div>
    </div>
  );

  const renderBulkToast = (data, t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5 p-4`}
    >
      <p className="font-semibold text-blue-700">{data.message}</p>
      <p className="text-sm text-gray-700 mt-1">
        Order ID: {data.orderId} | Items: {data.itemsCount || "Multiple"}
      </p>
    </div>
  );

  const showToastWithDelay = useCallback(async (notifications) => {
    if (!notifications?.length) return;

    for (let i = 0; i < notifications.length; i++) {
      const data = notifications[i];

      if (data.orderId) {
        toast.custom((t) => renderBulkToast(data, t));
        await markBulkAsRead(data.orderId);
      } else {
        toast.custom((t) => renderSingleToast(data, t));
        await markAsRead(data.productId);
      }

      await new Promise((res) => setTimeout(res, 3000)); // Pause between toasts
    }
  }, []);

  useEffect(() => {
    if (!currentCustomer?.id) return;

    const fetchUnread = async () => {
      try {
        const response = await findUnReadNotification(currentCustomer.id);

        if (response?.notifications?.length > 0) {
          await showToastWithDelay(response.notifications);
        } else if (response?.message) {
          toast.success(response.message);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications.");
        console.error("Notification error:", error);
      }
    };

    fetchUnread();
  }, [currentCustomer, showToastWithDelay]);

  useEffect(() => {
    if (!currentCustomer?.id) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
      query: { userId: currentCustomer.id },
    });

    socketRef.current.on("deliveryUpdate", async (data) => {
      await showToastWithDelay([data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentCustomer, showToastWithDelay]);

  return null; // Just a hook, no render
};

export default useDeliveryNotification;
