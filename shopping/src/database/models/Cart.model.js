import {Schema,model} from "mongoose";

const cartSchema = new Schema({
  userId: { type:Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      productId: { type:Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      imageUrl: String,
      price: Number,
      quantity: { type: Number, required: true, min: 1 },
    }
  ]
}, { timestamps: true });

const Cart = model("Cart", cartSchema);
export default Cart;