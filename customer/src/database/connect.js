import mongoose from "mongoose";
import log from "../utils/logHandler.js";
import { DB_URI } from "../config/config.js";

const connectDb = async()=>{
    try {
        const connectionInstance = await mongoose.connect(DB_URI)

        log.info(`MongoDb Connected  [[DB HOST : ${connectionInstance.connection.host}]]`);

    } catch (error) {
        log.error("Error connecting to Db",error);
        process.exit(1);
    }
}

export default connectDb;