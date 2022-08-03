import { NextRequest, NextResponse } from "next/server";

import { server } from "config";

export default function _middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const userInfo = req.cookies.get("uname");
  let res = NextResponse.next();
  if (
    !token &&
    userInfo &&
    !req.url.includes("/login") &&
    !req.url.includes("/signup") &&
    !req.url.includes("/verification")
  ) {
    res.cookies.set("token", "");
    res.cookies.set("uname", "");
  }
  if (
    !userInfo &&
    token &&
    !req.url.includes("/login") &&
    !req.url.includes("/signup") &&
    !req.url.includes("/verification")
  ) {
    res.cookies.set("token", "");
  }

  if (req.url.includes("/login") || req.url.includes("/signup")) {
    if (token && userInfo) {
      return NextResponse.redirect(`${server}`);
    }
  }
  return res;
}
