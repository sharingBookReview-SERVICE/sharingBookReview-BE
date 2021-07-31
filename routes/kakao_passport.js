import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";
import { Strategy } from "passport-kakao";

const kakaoPassportConfig = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    })
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    })
    
    passport.use(
		new Strategy(
			{
				clientID: '89c020b3b307f237f8e3e3135ce353cf',
				clientSecret: '',
				callbackURL: 'http://localhost:3000/api/users/kakao/callback',
                // http://13.124.63.103/api/users/kakao/callback
			},
			async (_, __, profile, done) => {
				const providerKey = profile.id
				const provider = profile.provider

                const user = {
                    provider,
                    providerKey
                }
				
				return done(null, user)
			}
		)
	)
}
export { kakaoPassportConfig };