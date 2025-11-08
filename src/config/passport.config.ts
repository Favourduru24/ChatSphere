import passport from "passport";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import { ENV } from "./env.config";
import { findByIdUserService } from "../services/user.service";

passport.use(
    new jwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                const token = req.cookies.accessToken
                if(!token) throw new Error('Unauthorized access')
                    return token
                }
            ]),
            secretOrKey: ENV.JWT_SECRET,
            audience: ["user"],
            algorithms: ['HS256']
        },
        async ({userId}, done) => {
           try {
             const user = userId && (await findByIdUserService(userId))
             return done(null, user || false)
           } catch (error) {
             return done(null, false)
           }
        }
    )
)

export const passportAuthenticateJwt = passport.authenticate('jwt', {
    session: false
})