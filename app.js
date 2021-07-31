import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import './models/index.js'
import router from './routes/index.js'
import session from "express-session";
import passport from "passport";
import { kakaoPassportConfig } from "./routes/kakao_passport.js";

dotenv.config()

const app = new express()

app.set('port', process.env.PORT)

app.use(cors())
app.use(router)

app.use(session({secret: "secret key", resave: false, saveUninitialized: false}));

app.use(passport.initialize())
app.use(passport.session())

kakaoPassportConfig()

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router doesn't exist`)
	error.status = 404
	next(error)
})

app.use((err, req, res, next) => {
	console.error(err)
	return res.status(err.status).json(err)
})

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})