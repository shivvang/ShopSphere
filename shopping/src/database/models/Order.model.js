import  { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true }, 
      },
    ],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

export default Order;
