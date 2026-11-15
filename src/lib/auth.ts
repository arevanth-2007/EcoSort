import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SessionUser, Role } from "./types";
import prisma from "./db";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "ecosort-fallback-dev-secret-key-32-chars-long";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "ecosort_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      citizenId: (payload.citizenId as string) || null,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as Role,
      mobile: (payload.mobile as string) || null,
      avatarUrl: (payload.avatarUrl as string) || null,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentDbUser() {
  const session = await getSessionUser();
  if (!session) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        citizenProfile: true,
        wallet: true,
      },
    });
  } catch (err) {
    console.error("Error fetching db user:", err);
    return null;
  }
}

export async function requireCitizen() {
  const user = await getSessionUser();
  if (!user || user.role !== "CITIZEN") {
    return null;
  }
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export { COOKIE_NAME };
