const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const googleCredentials = require('./config/google.json')
consol.log(googleCredentials.web.client_id)
passport.use(
	new GoogleStrategy(
		{
			clientID: googleCredentials.web.client_id,
			clientSecret: googleCredentials.web.client_secret,
			callbackURL: googleCredentials.web.redirect_uris[0],
		},
		function (accessToken, refreshToken, profile, done) {
			// DB에서 User 정보(porfile)를 받아옴.
			console.log('GoogleStrategy', accessToken, refreshToken, profile)
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user)
			})
		}
	)
)

// 인증서 & scope 설정
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login'],
	})
)

// 임시 코드 발행
app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/auth/login' }),
	function (req, res) {
		res.redirect('/')
	}
)
