import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.S3_CLIENT_ACCESS_KEY,
        secretAccessKey:process.env.S3_CLIENT_SECRET_KEY,
    }
})

  async function getSignedUploadUrl(filename, mimeType) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      ContentType: mimeType,
      ACL: "public-read"
    });
  
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
  }

  async function deleteUploadedFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    return s3Client.send(command);
  }

export {getSignedUploadUrl,deleteUploadedFile}; 