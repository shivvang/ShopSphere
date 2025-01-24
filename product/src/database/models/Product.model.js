
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    tags: [{ type: String, lowercase: true, trim: true }],
    searchKeywords: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true }
);

// **Indexes for better search performance**
productSchema.index({ name: "text", description: "text", tags: "text" ,searchKeywords:"text"});

productSchema.index({ tags: 1 });
productSchema.index({ searchKeywords: 1 });

//By default, virtuals are not included in JSON

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });


// **Virtual field for final price after discount**
productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
