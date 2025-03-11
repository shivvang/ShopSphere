import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js";

const verifyRefreshToken = (req,res,next)=>{

    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            log.warn("No accessToken provided in cookies.");
            return next(new ApiError(401, "access Token is required"));
        }

        jwt.verify(refreshToken, process.env.SELLER_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                log.error("Invalid or expired access Token", err);
                return next(new ApiError(403, "Invalid or expired access Token"));
            }

            req.sellerId = decoded.sellerId;
            next();
        });

    } catch (error) {
        log.error("Error while verifying access Token", error);
        return next(new ApiError(500, "Internal server error"));
    }
}

export default verifyRefreshToken;