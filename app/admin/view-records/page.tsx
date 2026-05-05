"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Professor, Subject } from "@/types";

export default function ViewRecordsPage() {
  const [activeTab, setActiveTab] = useState<"PROFESSORS" | "SUBJECTS">(
    "PROFESSORS",
  );
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, subRes] = await Promise.all([
          fetch("/api/professors"),
          fetch("/api/subjects"),
        ]);

        if (profRes.ok) setProfessors(await profRes.json());
        if (subRes.ok) setSubjects(await subRes.json());
      } catch (error) {
        console.error("Failed to fetch records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string, type: "PROFESSOR" | "SUBJECT") => {
    if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`))
      return;

    const endpoint =
      type === "PROFESSOR" ? `/api/professors/${id}` : `/api/subjects/${id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        // Remove it from the screen immediately
        if (type === "PROFESSOR") {
          setProfessors(professors.filter((p) => p._id !== id));
        } else {
          setSubjects(subjects.filter((s) => s._id !== id));
        }
      }
    } catch (error) {
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Header & Tabs */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">System Records</h1>

          <div className="flex bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("PROFESSORS")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "PROFESSORS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Faculty Directory
            </button>
            <button
              onClick={() => setActiveTab("SUBJECTS")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "SUBJECTS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Course Catalog
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-0">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading records...
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === "PROFESSORS" ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-sm text-gray-600">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-gray-500"
                        >
                          No professors registered yet.
                        </td>
                      </tr>
                    ) : (
                      professors.map((prof) => (
                        <tr
                          key={prof._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-medium text-gray-800">
                            {prof.name}
                          </td>
                          <td className="p-4 text-gray-600">{prof.email}</td>
                          <td className="p-4 text-gray-600">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                              {prof.branch}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() =>
                                handleDelete(prof._id, "PROFESSOR")
                              }
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-sm text-gray-600">
                      <th className="p-4 font-semibold">Course Code</th>
                      <th className="p-4 font-semibold">Subject Name</th>
                      <th className="p-4 font-semibold">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-gray-500"
                        >
                          No subjects registered yet.
                        </td>
                      </tr>
                    ) : (
                      subjects.map((sub) => (
                        <tr
                          key={sub._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-bold text-gray-700 uppercase">
                            {sub.courseId}
                          </td>
                          <td className="p-4 text-gray-800">{sub.name}</td>
                          <td className="p-4 text-gray-600">
                            {sub.credits || "-"}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleDelete(sub._id, "SUBJECT")}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
          <div className="space-x-4">
            <Link
              href="/admin/professors"
              className="text-sm text-gray-600 hover:text-blue-600 font-medium"
            >
              + Add Professor
            </Link>
            <Link
              href="/admin/subjects"
              className="text-sm text-gray-600 hover:text-blue-600 font-medium"
            >
              + Add Subject
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
