'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center bg-gray-50 space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Semester Routine Manager</h1>
        <p className="text-gray-500">Manage schedules, faculty, and courses in one place.</p>
      </div>

      {/* Login Prompt Banner */}
      {!session && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm max-w-lg text-center shadow-sm">
          <strong>Authentication Required:</strong> You must be logged in as an Admin to explore the dashboard or modify records. 
          <br />
          <Link href="/login" className="font-bold underline text-blue-600 hover:text-blue-800 mt-2 block">
            Click here to Login
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Card 1: Main Dashboard */}
        <Link href="/dashboard" className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 text-center group flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Go to Dashboard &rarr;</h2>
          <p className="text-gray-500 mt-2 text-sm">View and manage the weekly routine grid.</p>
        </Link>

        {/* Card 2: View Records */}
        <Link href="/admin/view-records" className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 text-center group flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">View Directory &rarr;</h2>
          <p className="text-gray-500 mt-2 text-sm">See all registered Professors and Subjects.</p>
        </Link>

        {/* Card 3: Admin Data Entry */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Setup</h2>
          <div className="flex flex-col space-y-3">
            <Link href="/admin/professors" className="bg-gray-100 hover:bg-gray-200 text-blue-700 py-2 rounded text-sm font-medium transition">Register Professor</Link>
            <Link href="/admin/subjects" className="bg-gray-100 hover:bg-gray-200 text-blue-700 py-2 rounded text-sm font-medium transition">Register Subject</Link>
          </div>
        </div>
      </div>
    </div>
  );
}