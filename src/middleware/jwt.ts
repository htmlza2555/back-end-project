import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const";

export interface AuthStatus {
  user: { id: string };
}

export default class JWTMiddleware {
  constructor() {}

  auth: RequestHandler<unknown, unknown, unknown, unknown, AuthStatus> = (
    req,
    res,
    next
  ) => {
    try {
      const token = req.header("Authorization")!.replace("Bearer ", "").trim();

      const { id } = verify(token, JWT_SECRET) as JwtPayload;

      res.locals = {
        user: {
          id,
        },
      };

      return next();
    } catch (error) {
      console.log(error);

      if (error instanceof TypeError)
        return res.status(401).json("Authorization header is expected").end();
      if (error instanceof JsonWebTokenError)
        return res.status(403).send(`Forbidden: Token is invalid`).end();

      return res.status(500).send("Internal Server Error").end();
    }
  };
}
