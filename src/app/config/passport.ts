import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { ENV } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { AppError } from "../../errors";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // if (!user.isVerified) {
        //   return done("User not verified");
        // }

        // if (
        //   user.isActive === IsActive.BLOCKED ||
        //   user.isActive === IsActive.INACTIVE
        // ) {
        //   return done(`User is ${user.isActive}`);
        // }

        // if (user.isDeleted) {
        //   return done("User is deleted");
        // }


        if (!user.isVerified) {
        return done(null, false, { message: "User not verified" });
        }

        if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
        return done(null, false, { message: `User is ${user.isActive}` });
        }

        if (user.isDeleted) {
        return done(null, false, { message: "User is deleted" });
        }

        const isGoogleAuthenticated = user.auths?.some(
          (auth) => auth.provider === "google"
        );

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "You have previously signed up with Google. Please use Google login.",
          });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password,
          user.password as string
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);




passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found"), false, {
            message: "No email found",
          });
        }
        const user = await User.findOne({ email });

        if (user) {
          if (!user.isVerified) {
            return done(null, false, {message: "User not verified"});
          }
          if (
            user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE
          ) {
            return done(null, false, {message : `User is ${user.isActive}`});
          }

          if (user.isDeleted) {
            return done(null, false, {message : "User is deleted"});
          }
        }

        if (!user) {
          // If user doesn't exist, create a new one
          const newUser = new User({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
          await newUser.save();
          return done(null, newUser);
        }

        return done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});




//frontend localhost:5173 -> http://localhost:5000/api/v1/auth/google ->
// passport -> Google oauth consent screen  ->
// select gmail -> after login successful - >
// http://localhost:5000/api/v1/auth/google/callback

//Bridge
//custom -> email , password, role : USER, name... -> registration -> DB -> 1 user create
//Google -> req -> google -> successful : JWT token : user role, email -> DB store -> role , email , id
