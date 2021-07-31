import jwt from "jsonwebtoken";
import Users from "../schemas/user";
import passportRouter from "passport";
import { Strategy } from "passport-kakao";

const kakaoPassportConfig = () => {
    passportRouter.serializeUser((user, done) => {
        done(null, user);
    })
    
    passportRouter.deserializeUser((user, done) => {
        done(null, user);
    })
    
    passportRouter.use(
		new Strategy(
			{
				clientID: '89c020b3b307f237f8e3e3135ce353cf',
				clientSecret: '',
				callbackURL: 'http://13.124.63.103/api/users/kakao/callback',
			},
			async (_, __, profile, done) => {
				const providerKey = profile.id
				const provider = profile.provider
				
				return done(null, user)
			}
		)
	)
}
export { kakaoPassportConfig };