import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('./protos/recommendation.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const recommendationPackage = grpcObject.recommendation;

const client = new recommendationPackage.RecommendationService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export default client;
