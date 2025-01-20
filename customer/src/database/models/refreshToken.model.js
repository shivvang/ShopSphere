import mongoose  from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer"
    },
    expiresIn:{
        type:Date,
        required:true,
    }
},{timestamps:true});

refreshTokenSchema.index({expiresIn:1},{expireAfterSeconds:0})

const RefreshToken = mongoose.model("RefreshToken",refreshTokenSchema);

export default RefreshToken;