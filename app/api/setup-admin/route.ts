import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  
  const email = "adminecm@nitjsr.in";
  const rawPassword = "ecm1234";

  // Check if already exists
  const existing = await Admin.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists!" });
  }

  // Hash the password securely
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  // Save to DB
  await Admin.create({ email, passwordHash });

  return NextResponse.json({ 
    message: "Admin created successfully!", 
    email: email, 
    password: rawPassword 
  });
}