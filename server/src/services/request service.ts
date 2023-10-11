import { StatusCodes } from "http-status-codes";
import { HttpError, verifyToken } from "../utils";
import { Jwt, JwtPayload } from "jsonwebtoken";

const User = require('../models/user.model')
const request = require('../models/request.model');

const getDoctor = (id:string,token:string)=>
{
    const decoded = verifyToken(token) as JwtPayload;
    if(!(decoded.role === 'Adminstrator'))
    {
        throw new HttpError(StatusCodes.UNAUTHORIZED,"Not Authorized!");
    }
    const user = User.findById(id).populate('RequestId');
    if(!user)
    {
        throw new HttpError(StatusCodes.BAD_REQUEST,
            "Either this Doctor is already accepted or this is an invalid id");
    }
    return user;
}
