import { users, transformations, vipSessions, type User, type InsertUser, type Transformation, type InsertTransformation, type VipSession, type InsertVipSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createTransformation(transformation: InsertTransformation): Promise<Transformation>;
  getTransformation(id: number): Promise<Transformation | undefined>;
  getUserTransformations(userId?: number): Promise<Transformation[]>;
  
  createVipSession(session: InsertVipSession): Promise<VipSession>;
  getVipSession(sessionKey: string): Promise<VipSession | undefined>;
  deactivateVipSession(sessionKey: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createTransformation(insertTransformation: InsertTransformation): Promise<Transformation> {
    const [transformation] = await db
      .insert(transformations)
      .values(insertTransformation)
      .returning();
    return transformation;
  }

  async getTransformation(id: number): Promise<Transformation | undefined> {
    const [transformation] = await db.select().from(transformations).where(eq(transformations.id, id));
    return transformation || undefined;
  }

  async getUserTransformations(userId?: number): Promise<Transformation[]> {
    if (userId) {
      return await db.select().from(transformations).where(eq(transformations.userId, userId));
    }
    return await db.select().from(transformations);
  }

  async createVipSession(insertVipSession: InsertVipSession): Promise<VipSession> {
    const [session] = await db
      .insert(vipSessions)
      .values(insertVipSession)
      .returning();
    return session;
  }

  async getVipSession(sessionKey: string): Promise<VipSession | undefined> {
    const [session] = await db.select().from(vipSessions).where(eq(vipSessions.sessionKey, sessionKey));
    return session || undefined;
  }

  async deactivateVipSession(sessionKey: string): Promise<void> {
    await db.update(vipSessions)
      .set({ isActive: false })
      .where(eq(vipSessions.sessionKey, sessionKey));
  }
}

export const storage = new DatabaseStorage();
