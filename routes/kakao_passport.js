import config from '../config.js'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import passport from 'passport'
import { Strategy } from 'passport-kakao'

config()

let callbackURL = 'http://localhost:3000/api/users/kakao/callback'
if (process.env.NODE_ENV === 'production') {
	callbackURL = process.env.KAKAO_CALLBACK_URL
}

const kakaoPassportConfig = () => {
	passport.use(
		new Strategy(
			{
				clientID: process.env.KAKAO_CLIENT_ID,
				clientSecret: '',
				callbackURL,
			},
			async (_, __, profile, done) => {
				const providerKey = profile.id
				const provider = profile.provider

				let user = await User.findOne({ provider, providerKey })

				if (!user) {
					user = await User.create({ provider, providerKey })
				}

				const token = jwt.sign(
					{ userId: user._id, nickname: user.nickname },
					process.env.TOKEN_KEY,
					{ expiresIn: '24h' }
				)

				return done(null, user, token)
			}
		)
	)
}
export default kakaoPassportConfig
