import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { authenticated } from "../../../middlewares/auth";

export default authenticated(async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  res.setHeader("Set-Cookie", [
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    }),
    cookie.serialize("uname", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    }),
  ]);
  res.status(200).json({ message: "Logout successful" });
});
