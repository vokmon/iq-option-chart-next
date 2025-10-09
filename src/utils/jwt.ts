import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface UserJwtPayload {
  email: string;
  iq_option_id: string;
  expired_at: string;
  iat?: number;
  exp?: number;
}

export function createJWT(userData: {
  email: string;
  iq_option_id: string;
  expired_at: string;
}): string {
  const payload: UserJwtPayload = {
    email: userData.email,
    iq_option_id: userData.iq_option_id,
    expired_at: userData.expired_at,
  };

  return jwt.sign(payload, JWT_SECRET);
}

export function verifyJWT(token: string): UserJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
