import  { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      imageUrl: String,
      price: Number,
    }
  ],
}, { timestamps: true });

const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;