import jwt, { JwtPayload } from "jsonwebtoken";

export const decodeToken = (token: string): JwtPayload | null => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    console.error("JWT secret key is not defined.");
    return null;
  }

  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
