import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { ENV } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);
router.post("/set-password",checkAuth(...Object.values(Role)) , AuthControllers.setPassword);


//frontend forget password route -> email -> user status check -> short expiration token (10 min)

// token {user id , password} -> email sent -> frontend link http://localhost:5173/reset-password?email=useremail@gmail.com&token=token 
// -> from frontend from Query user email and token will be extract -> taken new password from user 
//-> /reset-password (backend) api hit -> authorization = token -> new password in body -> token verifiy -> hash pasword and set it -> save user password

router.post("/forget-password", AuthControllers.forgetPassword);
router.post("/reset-password",AuthControllers.resetPassword);




router.get("/google", async(req:Request, res:Response, next:NextFunction)=>{
    
    const redirect = req.query.redirect as string || "/";
    passport.authenticate("google", 
        {scope: ["email", "profile"], state: redirect})(req, res, next);
})


//orginal
router.get("/google/callback", passport.authenticate("google", 
    {failureRedirect: `${ENV.FRONTEND_URL}?error=There is some issue with your account. Please contact with our support`}), AuthControllers.googleAuthCallback);




// Google OAuth callback (custom callback style)
// router.get("/google/callback", AuthControllers.googleAuthCallback);


export const AuthRouter = router;