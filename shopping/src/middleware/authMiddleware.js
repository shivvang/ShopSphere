import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js";
import jwt from "jsonwebtoken";

const authenticatedRequest = (req,res,next)=>{

    log.info("validating user before hitting the problem routes");

    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
        log.warn("No accessToken provided in cookies.");
        return next(new ApiError(401, "access Token is required"));
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            log.error("Invalid or expired access Token", err);
            return next(new ApiError(403, "Invalid or expired access Token"));
        }

        req.user = decoded.userId;
        log.info("User authenticated for Shopping routes");
        next();
    });
}

export default authenticatedRequest;