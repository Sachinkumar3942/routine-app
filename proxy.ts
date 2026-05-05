import nextAuthMiddleware from "next-auth/middleware";

// We explicitly declare the function here so Next.js 16 recognizes it
export default function proxy(req: any) {
  return nextAuthMiddleware(req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ]
};