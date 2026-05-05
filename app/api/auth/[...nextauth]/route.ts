import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@college.edu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Find the admin in the database
        const admin = await Admin.findOne({ email: credentials.email });

        if (!admin) {
          throw new Error("No admin found with this email");
        }

        // Compare the entered password with the hashed password in DB
        const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // If success, return the user object (saved to session)
        return { id: admin._id.toString(), email: admin.email };
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirect to our custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };