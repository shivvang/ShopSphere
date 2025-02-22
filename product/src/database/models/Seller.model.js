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

const Seller = mongoose.model("Seller",sellerSchema);

sellerSchema.pre("save",async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcryptjs.hash(this.password,10);
    next();
});


sellerSchema.methods.comparePassword = async function(password){
    return bcryptjs.compare(password,this.password);
}


sellerSchema.methods.generateAccessToken =  function(){
   jwt.sign({sellerId:this._id},process.env.SELLER_ACCESS_TOKEN_SECRET,{
    expiresIn:SELLER_ACCESS_TOKEN_EXPIRY
   })
}

sellerSchema.methods.generateRefreshToken = function (){
    jwt.sign({sellerId:this._id},process.env.SELLER_REFRESH_TOKEN_SECRET,{expiresIn:SELLER_REFRESH_TOKEN_EXPIRY})
}

export default Seller;

