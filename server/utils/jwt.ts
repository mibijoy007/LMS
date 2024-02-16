import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

require("dotenv").config();


interface ITokenOptions{
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean
}

export const sentToken  = (user:IUser, statusCode: number, res:Response) => {
    const accessToken = user.SignInOutAccessToken();
    const refreashToken = user.SignInOutRefreashToken();


    
    //upload the session to redis(if the user successfully signed in to the account then we'll save the session to redis)
    redis.set(user._id, JSON.stringify(user) as any);




    //parse env to integrate with fallback values ( time is in seconds)
    const accessTokenExpire = parseInt(process.env.SIGN_IN_OUT_ACCESS_TOKEN_EXPIRE || '300',10);
    const refreashTokenExpire = parseInt(process.env.SIGN_IN_OUT_REFREASH_TOKEN_EXPIRE || '1200',10);


    //options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

    const refreashTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreashTokenExpire * 1000),
        maxAge: refreashTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }

    //only set 'secure' to 'true' when production
    if(process.env.NODE_ENV === 'production'){
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refreash_token",refreashToken, refreashTokenOptions)

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        // refreashToken
    })
}