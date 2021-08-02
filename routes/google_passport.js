const express = require('express')
const passport = require('passport')
const session = require('express-session'),
	bodyParser = require('body-parser')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const googleCredentials = require('./config/google.json')
consol.log(googleCredentials.web.client_id)
passport.use(
	new GoogleStrategy(
		{
			clientID: googleCredentials.web.client_id,
			clientSecret: googleCredentials.web.client_secret,
			callbackURL: googleCredentials.web.redirect_uris,
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user)
			})
		}
	)
)

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login'],
	})
)
