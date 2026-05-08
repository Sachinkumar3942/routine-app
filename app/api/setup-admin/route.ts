import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  
  const branches = ["cse", "ece", "ee", "mech", "pie", "ecm", "meta"];
  const created = [];

  for (const branch of branches) {
    const email = `admin${branch}@nitjsr.in`;
    const rawPassword = `${branch}1234`;

    const existing = await Admin.findOne({ email });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(rawPassword, salt);
      await Admin.create({ email, passwordHash });
      created.push(email);
    }
  }

  if (created.length === 0) {
    return NextResponse.json({ message: "All admins already exist!" });
  }

  return NextResponse.json({ 
    message: "Admins created successfully!", 
    created 
  });
}