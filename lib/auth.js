import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'supersecretjwtkey12345';
const encodedKey = new TextEncoder().encode(secretKey);

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload;
  } catch (error) {
    return null;
  }
}
