import { Request, Response, NextFunction } from "express";

const queryParser = (req: Request, res: Response, next: NextFunction): void => {
  for (const key in req.query) {
    if (key.includes(".")) {
      const [outerKey, innerKey, other] = key.split(".");

      if (!req.query[outerKey]) req.query[outerKey] = {};

      (req.query[outerKey] as any)[innerKey] = req.query[key];
      delete req.query[key];
    }
  }

  next();
};

export { queryParser };
