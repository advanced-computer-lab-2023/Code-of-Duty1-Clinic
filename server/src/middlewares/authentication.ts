import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import { StatusCodes } from "http-status-codes";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the JWT token from the request headers, query parameters, or cookies, as needed
    const token =
      req.headers.authorization || req.query.token || req.cookies.token;

    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Missing token" });

    // Verify the JWT token
    const decoded = await verifyToken(token);

    if (decoded) {
      req.body.user = decoded; // Store the decoded user information in the request
      next(); // Call the next middleware
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { isAuthenticated };
