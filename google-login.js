const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.use(
	new GoogleStrategy(
		{
			clientID:
				531193406993 -
				gf1v14ui793k2nv119nq0be6eaqgtt8h.apps.googleusercontent.com,
			clientSecret: kY3QDE2eRhViy1ehE4yVFmvs,
			callbackURL: 'http://www.example.com/auth/google/callback',
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user)
			})
		}
	)
)
