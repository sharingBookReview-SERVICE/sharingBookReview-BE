import { io } from './app.js'
import { validateToken } from './controllers/utilities.js'

const connectedUser = {}
//todo: 소켓 연결 자체를 로그인한 사람들만 연결해야함/ 즉 로그인 안한사람들은 연결할 필요가 없음
io.on('connection', (socket) => {
    // front에서 extraHeaders에 값을 담아보내면 handshake.headers에 값을 받을 수 있다.
    socket.on('token', (token) => {
        const userId = validateToken({token})
        connectedUser[userId] = socket.id
        console.log(connectedUser)
    })
    
    socket.on('disconnect', () =>{
        console.log('연결해제')
    })
    
    socket.on("comment", (userId) =>{
        socket.to(connectedUser[userId]).emit("alert", true )
    })

    socket.on("follow", (userId) =>{
        socket.to(connectedUser[userId]).emit("alert", true )
    })

    socket.on("like", (userId) =>{
        socket.to(connectedUser[userId]).emit("alert", true )
    })
})