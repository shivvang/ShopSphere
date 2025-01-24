import dotenv from "dotenv";
dotenv.config();


export const PORT = process.env.PORT || 7002;
export const DB_URI =process.env.MONGO_DB_URI;


