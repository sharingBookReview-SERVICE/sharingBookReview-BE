import express from 'express'
import config from './config.js'
import cors from 'cors'
import './models/index.js'
import './controllers/schedule_job.js'
import router from './routes/index.js'
import kakaoPassportConfig from "./routes/kakao_passport.js";
import googlePassportConfig from './routes/google_passport.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connect ,User } from './models/index.js'

config()

const app = new express()
const server = createServer(app);

app.set('port', process.env.PORT)

app.use(cors())

app.use(router)

kakaoPassportConfig()
googlePassportConfig()


const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

io.on("connection", (socket) => {
    console.log(socket.id)
    console.log("클라이언트 연결 성공");

    connect.then( (db) => {
        console.log("몽고디비 연결 성공")
    })

    socket.on('disconnect', () => {
        console.log("클라이언트가 연결 해제")
    })

    socket.on("comment", (data) => {
        const { writer } = data
        const { target } = data

        console.log(writer, target)
    
        io.emit("comment", writer)
    })

})

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router doesn't exist`)
	error.status = 404
	next(error)
})

app.use((err, req, res, next) => {
	console.error(err)
	return res.status(400).json({ error: err.message })
})

server.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})
