import  { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: { type:Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      productId: { type:Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      imageUrl: String,
      priceAtPurchase: Number,
      quantity: Number,
      status: { type: String, enum: [ "shipped", "delivered", "cancelled"], default: "shipped" },
    }
  ],
}, { timestamps: true });

const Order = model("Order", orderSchema);

export default Order;
