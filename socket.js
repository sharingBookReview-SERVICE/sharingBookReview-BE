import { io } from './app.js'
import { validateToken } from './controllers/utilities.js'

//todo: 소켓 연결 자체를 로그인한 사람들만 연결해야함/ 즉 로그인 안한사람들은 연결할 필요가 없음
io.on('connection', (socket) => {
    const { token } = socket.handshake.headers
    console.log(validateToken({token}))
})