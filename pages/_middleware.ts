import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

interface NextApiRequestProp extends NextApiRequest {
  nextUrl: {
    pathname: string;
  };
}

export async function middleware(req: NextApiRequestProp) {
  const token = await getToken({ req, secret: String(process.env.JWT_SECRET) });

  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/auth/") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
