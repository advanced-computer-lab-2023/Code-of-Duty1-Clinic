import { Jwt } from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { HttpError, generateToken,verifyToken } from '../utils';
import { putRedis,getRedis } from '../utils';
import { StatusCodes } from 'http-status-codes';
import Request from '../models/request.model';

const User = require('../models/user.model')





const register = async(body:any)=>
{
    const user = new User(body);
    await user.save();
    if(body.role === 'Doctor')
    {
        const newRequest = new Request({
            medicID: user._id,
            ID: body.id,
            degree:User.degree,
            licenses: body.licenses,
            status:'Pending',
            date: new Date()
        })
        await newRequest.save()
    }
    let token = generateToken(user._id,body.role);
    putRedis(token,token)
    return {
        status:StatusCodes.CREATED,
        message: "User created successfully",
        result:user,
        token:token
    };
}

const login = async(body:any,token:Jwt)=>
{
    const tokenExists = token ? await getRedis(token) : undefined
    if(!tokenExists)
    {
        throw new HttpError(StatusCodes.UNAUTHORIZED,"There is no token")
    }
    const{username,password} = body;
    const user = await User.findOne({username:username}).select("+password");
    if(!user)
    {
        throw new HttpError(StatusCodes.UNAUTHORIZED,"Please enter correct username and password");
    }
    const passwordMatch = await user.comparePasswords(password);
    if(!passwordMatch)
    {
        throw new HttpError(StatusCodes.UNAUTHORIZED,"Please enter correct username and password");
    }
    return{
        status: StatusCodes.OK,
        message:'User logged in successfully',
        result:user
    };
} 

export {register,login};