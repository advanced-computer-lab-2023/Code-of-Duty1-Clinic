import { Jwt, JwtPayload } from "jsonwebtoken"
import { HttpError, verifyToken } from "../utils"
import { StatusCodes } from 'http-status-codes';


const User = require('../models/user.model')

const deleteUser = async(id:String,token:string) =>
{
    const decoded = verifyToken(token) as JwtPayload;
    if(!(decoded.role === 'Administrator'))
    {
        throw new HttpError(StatusCodes.BAD_REQUEST,"Not authorized!");
    }

    const user = await User.findOneAndDelete({_id:id});
    if(!user)
    {
        throw new HttpError(StatusCodes.NOT_FOUND,"User not found");
    }
    return{
        status: StatusCodes.OK,
        message: "User deleted successfully"
    }
}