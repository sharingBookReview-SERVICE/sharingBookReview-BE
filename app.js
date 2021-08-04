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
app.use(session({
    key:'ohbin',
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

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