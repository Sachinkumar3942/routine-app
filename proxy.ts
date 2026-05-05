export { default } from "next-auth/middleware";

// These are the routes you want to protect
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin/:path*"
  ]
};