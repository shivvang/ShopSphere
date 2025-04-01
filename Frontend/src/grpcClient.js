import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Load the .proto file
const PROTO_PATH = path.join(__dirname, "protos", "recommendation.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

// Connect to the Product Service gRPC server
const client = new recommendationProto.RecommendationService(
  "localhost:50051", 
  grpc.credentials.createInsecure()
);

// Function to request recommendations
export function getRecommendations(userId) {
  return new Promise((resolve, reject) => {
    client.GetRecommendations({ userId }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.products);
      }
    });
  });
}


