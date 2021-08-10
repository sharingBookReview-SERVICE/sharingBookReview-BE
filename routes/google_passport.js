import config from '../config.js'
import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import { User } from '../models/index.js'
import jwt from 'jsonwebtoken'

config()

let callbackURL = 'http://localhost:3000/api/users/google/callback'
if (process.env.NODE_ENV === 'production') {
    callbackURL = process.env.GOOGLE_CALLBACK_URL
}

const googlePassportConfig = () => {
	passport.use(
		new OAuth2Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL,
			},

			async (accessToken, refreshToken, profile, done) => {
				const providerKey = profile.id
				const provider = profile.provider

				let user = await User.findOne({ provider, providerKey })

				if (!user) {
					user = await User.create({ provider, providerKey })
				}

				const token = jwt.sign(
					{ userId: user._id, nickname: user.nickname },
					process.env.TOKEN_KEY
				)

				return done(null, user, token)
			}
		)
	)
}

export default googlePassportConfig
