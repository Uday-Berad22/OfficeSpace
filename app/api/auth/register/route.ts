import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { name, email, password, mobile_number } = await req.json();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      mobile_number,
      access_level: 1,
      created_at: new Date()
    };

    await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}