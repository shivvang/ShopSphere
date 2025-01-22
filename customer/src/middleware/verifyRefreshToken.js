import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

async function verifyRefreshTokenMiddleware(req, res, next) {
    log.info("Verifying refresh token...");

    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            log.warn("No refresh token provided in cookies.");
            return next(new ApiError(401, "Refresh token is required"));
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                log.error("Invalid or expired refresh token", err);
                return next(new ApiError(403, "Invalid or expired refresh token"));
            }

            req.userId = decoded.userId;
            next();
        });

    } catch (error) {
        log.error("Error while verifying refresh token", error);
        return next(new ApiError(500, "Internal server error"));
    }
}

export default verifyRefreshTokenMiddleware;
