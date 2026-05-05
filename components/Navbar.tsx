'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, LogOut } from 'lucide-react'; 

export default function Navbar() {
  const { data: session, status } = useSession();

  // Extract name from email (e.g., admin@nitjsr.in -> admin)
  const userName = session?.user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center z-50 sticky top-0 h-15">
      <Link href="/" className="text-lg font-bold text-gray-800">
        <span className="text-blue-600">Smart</span>Routine
      </Link>
      
      <div className="flex items-center gap-4">
        {status === 'authenticated' ? (
          <>
            <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <UserCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md transition border border-transparent hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : status === 'loading' ? (
           <div className="text-sm text-gray-500 font-medium">Loading...</div>
        ) : (
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
}