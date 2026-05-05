export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Note: h-[calc(100vh-60px)] accounts for the 60px height of the new global Navbar
    <div className="h-[calc(100vh-60px)] w-full overflow-hidden bg-gray-100 flex flex-col">
      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}