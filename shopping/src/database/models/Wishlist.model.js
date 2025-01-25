import  { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;