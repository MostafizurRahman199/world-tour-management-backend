import { Response } from "express";


export interface AuthTokenInfo {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookies = (res:Response, tokenInfo: AuthTokenInfo)=>{

    if(tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
        });
    }

    if(tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
}



export const clearCookie = (res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
}