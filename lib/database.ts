import { ObjectId } from "mongodb";
import clientPromise from "./db";

export interface User {
  _id?: ObjectId;
  email: string;
  user_id: string;
  name: string;
  used_tokens: number;
  access_level: 'user' | 'admin';
  parking_allotment?: string;
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db("parking_system");
}