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
import { User, Alert } from './models/index.js'

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

let connectedUser = {}

// 클라이언트와 연결
io.on("connection", (socket) => {
    // 현재 로그인 한 사용자가 저장될 object
    // 로그인 
    socket.on('login', async (userId) => {
        // user 정보와 socket의 hash값으로 connectedUser에 저장
        const socketId = socket.id
        connectedUser[userId] = socketId

        console.log("클라이언트 연결, 접속 한 유저: ",connectedUser)
    })
    
    // 클라이언트가 comment event를 발생시켰을때
    socket.on("comment", async (data) => {
        const { userId, target, reviewId } = data
        // alert object 생성
        const alert = new Alert({ writer: userId, reviewId, type: 'comment'})
        // user를 찾아서 alert을 alerts 프로퍼티에 삽입
        await User.findByIdAndUpdate(target, {
            $push: {
                alerts: alert,
            },
        })
        // target이 접속중일때
        if(connectedUser.hasOwnProperty(target)){
            io.sockets.to(connectedUser[target]).emit("comment", true )
        }
    })

    // 연결이 끊어 졌을때 
    socket.on('logout', (userId) => {
        socket.on('disconnect', () => {
            delete connectedUser[userId]
            console.log("클라이언트가 연결 해제", connectedUser)
    })
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
