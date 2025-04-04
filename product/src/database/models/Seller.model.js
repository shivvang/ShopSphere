import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const sellerSchema = new mongoose.Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    shopName:{type:String,required:true},
    phone:{type:String,unique:true,required:true},
    products:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}]
},{timestamps:true})



sellerSchema.pre("save",async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcryptjs.hash(this.password,10);
    next();
});


sellerSchema.methods.comparePassword = async function(password){
    return bcryptjs.compare(password,this.password);
}


sellerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      { sellerId: this._id },
      process.env.SELLER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.SELLER_ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  
  sellerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { sellerId: this._id },
      process.env.SELLER_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.SELLER_REFRESH_TOKEN_EXPIRY }
    );
  };

const Seller = mongoose.model("Seller",sellerSchema);

export default Seller;

