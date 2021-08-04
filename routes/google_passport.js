import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import express from 'express'
import { User } from '../models/index.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const router = new express.Router()
// consol.log(googleCredentials.web.client_id)

passport.use(
	new OAuth2Strategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/callback',
		},
		function (accessToken, refreshToken, profile, done) {
			// DB에서 User 정보(porfile)를 받아옴.
			console.log('GoogleStrategy', accessToken, refreshToken, profile)
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				console.log(user)
				const token = jwt.sign({ userId: user._id }, 'Google_test')
				return done(null, user, token)
				// return done(err, user)
			})
		}
	)
)

// 인증서 & scope 설정
router.get(
	'/',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login'],
	})
)

// 임시 코드 발행
router.get('/callback', (req, res, next) => {
	passport.authenticate(
		'google',
		{ failureRedirect: '/' },
		(err, user, token) => {
			return res.redirect(
				`http://localhost:3000/logincheck/token=${token}`
			)
		}
	)
})

export default router
