import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import './models/index.js'
import router from './routes/index.js'
import session from "express-session";
import passport from "passport";
import kakaoPassportConfig from "./routes/kakao_passport.js";
import googlePassportConfig from './routes/google_passport.js'
import path from 'path'

if(process.env.NODE_ENV === 'production'){
    dotenv.config({
        path: path.join(process.cwd(), './config/server.env')
    })
} else if(process.env.NODE_ENV === 'test'){
    dotenv.config({
        path: path.join(process.cwd(), './config/test.env')
    })
}else{
    dotenv.config({
        path: path.join(process.cwd(), './config/dev.env')
    })
}
    


const app = new express()

app.set('port', process.env.PORT)

app.use(cors())
app.use(
	session({ secret: 'secret key', resave: false, saveUninitialized: false })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

kakaoPassportConfig()
googlePassportConfig()

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router doesn't exist`)
	error.status = 404
	next(error)
})

app.use((err, req, res, next) => {
	console.error(err)
	return res.json({ error: err.message })
})

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})
