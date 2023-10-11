import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../utils";
import User from "../../models/user.model";

export const updateInfo = (info: any) => {
  if ("password" in info)
    throw new HttpError(StatusCodes.FORBIDDEN, "you can't modify the password");
  
};
