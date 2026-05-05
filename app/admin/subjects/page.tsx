'use client';

import React, { useState } from 'react';

export default function RegisterSubjectPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    credits: 3, // Default to 3 credits
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Success: Subject added to catalog!');
        setFormData({ ...formData, name: '', courseId: '' }); // Reset text fields
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message || 'Failed to add subject.'}`);
      }
    } catch (error) {
      setMessage('Error: Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Subject</h1>

        {message && (
          <div className={`p-3 mb-4 text-sm rounded ${message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Database Management Systems"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Course ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course ID (Code)</label>
            <input
              type="text"
              name="courseId"
              required
              value={formData.courseId}
              onChange={handleChange}
              placeholder="CS1401"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">Must be unique (e.g., CS1401)</p>
          </div>

          {/* Credits (Optional but good to have) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Credits</label>
            <input
              type="number"
              name="credits"
              min="1"
              max="10"
              value={formData.credits}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
        </form>
      </div>
    </div>
  );
}