import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as any)?.role;

  // 1. Guard /student: Requires authenticated user
  if (pathname.startsWith("/student")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard /dashboard: Only managers or admins can open
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Students are strictly blocked from manager dashboard
    if (role === "student") {
      return NextResponse.redirect(new URL("/student?unauthorized=true", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/student/:path*", "/dashboard/:path*"],
};
