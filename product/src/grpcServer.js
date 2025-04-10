import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from "mongoose";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import Product from "./database/models/Product.model.js";
import connectDb from './database/connect.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, '../../protos/recommendation.proto');

// Load the .proto file
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const recommendationPackage = grpcObject.recommendation;

// gRPC handler function
async function GetRecommendations(call, callback) {
  try {
    console.log("📞 gRPC: GetRecommendations hit!");

    const { productIds } = call.request;

    const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(String(id)));

    const wishlistProducts = await Product.find({ _id: { $in: objectIds } });

    const allTags = wishlistProducts.flatMap((p) => p.tags);
    const categories = wishlistProducts.map((p) => p.category);
    const brands = wishlistProducts.map((p) => p.brand);

    let recommended;

    recommended = await Product.find({
      $or: [
        { tags: { $in: allTags } },
        { category: { $in: categories } },
        { brand: { $in: brands } },
      ],
      _id: { $nin: objectIds },
    }).limit(10);

    //if no recommendation then random
    if(recommended.length === 0){
      recommended = await Product.aggregate([
        { $sample: { size: 10 } },
      ]);
    }

    const formatted = recommended.map((prod) => ({
      id: prod._id.toString(),
      name: prod.name,
      imageUrl: prod.imageUrl,
      price: prod.price,
    }));

    callback(null, { products: formatted });
  } catch (err) {
    console.error("gRPC Error:", err);
    callback(err);
  }
}


async function GetOrderBasedRecommendations(call,callback){
  try {
    console.log("📞 gRPC: GetOrderBasedRecommendations hit!");

    const { productIds } = call.request;

    const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(String(id)));

    const orderedProducts = await Product.find({ _id: { $in: objectIds } });

    const allTags = orderedProducts.flatMap((p) => p.tags);
    const categories = orderedProducts.map((p) => p.category);
    const brands = orderedProducts.map((p) => p.brand);

    let recommended;

     recommended = await Product.find({
      $or: [
        { tags: { $in: allTags } },
        { category: { $in: categories } },
        { brand: { $in: brands } },
      ],
      _id: { $nin: objectIds },
    }).limit(10);

    //if no recommendation then random
    if(recommended.length === 0){
      recommended = await Product.aggregate([
        { $sample: { size: 10 } },
      ]);
    }
    
    const formatted = recommended.map((prod) => ({
      id: prod._id.toString(),
      name: prod.name,
      imageUrl: prod.imageUrl,
      price: prod.price,
    }));

    callback(null, { products: formatted });

  } catch (error) {
    console.error("gRPC Error:", error);
    callback(err);
  }
}

// Start the gRPC server
function startServer() {
  const server = new grpc.Server();
  server.addService(recommendationPackage.RecommendationService.service, {
    GetRecommendations, 
    GetOrderBasedRecommendations
  });

  const PORT = "50051";
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error("❌ Failed to bind gRPC server:", err);
      return;
    }
    console.log(`✅ gRPC Server running on port ${port}`);
  });
}

connectDb().then(()=>{
  startServer();
});
