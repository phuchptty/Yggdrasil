import jwt from "jsonwebtoken";

// Extract sub from jwt token skip expiration check
export const extractSubFromToken = (token: string): string => {
    const decoded = jwt.decode(token, {
        complete: true,
    });

    return decoded.payload?.sub as string;
};
