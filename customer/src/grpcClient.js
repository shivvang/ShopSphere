import path from 'path';
import { fileURLToPath } from 'url';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, '../../protos/recommendation.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const recommendationPackage = grpcObject.recommendation;

const client = new recommendationPackage.RecommendationService(
  '127.0.0.1:50051',
  grpc.credentials.createInsecure()
);

export default client;
