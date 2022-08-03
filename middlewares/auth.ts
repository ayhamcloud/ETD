import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const authenticated = (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.cookies) {
    res.status(401).json({
      error: "You must be logged in to do that",
    });
    return;
  }
  verify(
    req.cookies.token || "",
    process.env.JWT_SECRET || "",
    async (err, decoded) => {
      if (err) {
        res.status(401).json({
          error: "You must be logged in to do that",
        });
        return;
      }
      if (!err && decoded) {
        return await fn(req, res);
      }
    }
  );
};

const authenticatedAdmin = (fn) => async (req, res) => {
  if (!req.cookies) {
    res.status(401).json({
      error: "You must be logged in to do that",
    });
    return;
  }
  verify(
    req.cookies.token,
    process.env.JWT_SECRET || "",
    async (err, decoded) => {
      if (err) {
        res.status(401).json({
          error: "You must be logged in to do that",
        });
        return;
      }
      if (!err && decoded) {
        return await fn(req, res);
      }
    }
  );
};

export { authenticated, authenticatedAdmin };
