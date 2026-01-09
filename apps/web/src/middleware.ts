import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas liberadas sem login:
const PUBLIC_PATHS = [
  "/login",
  "/cadastro",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Libera arquivos internos do Next e assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // Libera API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Libera rotas públicas
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Checa cookie de sessão
  const token = req.cookies.get("dk_session")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // volta pra onde a pessoa queria ir
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
