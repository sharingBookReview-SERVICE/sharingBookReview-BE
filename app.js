import express from 'express'
import config from './config.js'
import cors from 'cors'
import './models/index.js'
import './controllers/schedule.controller.js'
import router from './routes/index.js'
import kakaoPassportConfig from "./routes/kakao_passport.js";
import googlePassportConfig from './routes/google_passport.js'
import { Server } from 'socket.io'
import { createServer } from "http";
import helmet from 'helmet'

config()

const app = new express()
const server = createServer(app)

app.set('port', process.env.PORT)

app.use(cors())
app.use(helmet())
app.disable('x-powered-by')
// noinspection JSUnusedAssignment
app.use(cors(corsOptions))

var corsOptions = {
    origin: [
        'https://bookdiver.net',
        'http://localhost:3000'
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204
}

app.use(router)

kakaoPassportConfig()
googlePassportConfig()

const io = new Server(server,{
    cors : {
        origin: '*'
    }
})
app.get('/', (req,res) =>{
    res.status(204)
})

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router doesn't exist`)
	error.status = 404
	next(error)
})

// noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => {
	console.error(err)
	return res.status(err.status ?? 400).json({ error: err.message })
})

export { io, server, app }
