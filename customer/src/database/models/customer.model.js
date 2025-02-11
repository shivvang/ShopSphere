import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const customerSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: { 
        type: String,
        required: true,
      },
      phone: {
        type: String,
        unique: true,
      },
      address: {
        street: String,
        postalCode: String,
        city: String,
        state: String,
        country: String,
        addressId:{ type:mongoose.Schema.Types.ObjectId, ref: "Address" },
      },
      cart: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          name: String,
          imageUrl: String,
          price: Number,
          quantity: { type: Number, required: true, min: 1 },
        }
      ],
      wishlist: [
        { 
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          name: String,
          imageUrl: String,
          price: Number,
        }
      ],
      orders: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1 },
          name: String,
          imageUrl: String,
          priceAtPurchase: Number,
          status: { type: String, enum: ["shipped", "delivered", "cancelled"], default: "shipped" },
        }
      ],
    },
    {
      toJSON: {
        transform(doc, ret) {
          delete ret.password;
          delete ret.__v;
        },
      },
      timestamps: true,
    }
  );


customerSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})

customerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
customerSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
      {
          userId: this._id,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET, 
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
  );
};

customerSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
      { userId: this._id },
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
const Customer = mongoose.model("Customer", customerSchema);

export default Customer;