import socket from 'ws'

const webSocket = (server) => {
    const wss = new socket.Server({server})

    // wss : websocket server
    // ws : websocket
    wss.on('connection', (ws, req) => {
        // req에 담긴 ip주소를 받아오는 방법
        // 앞의 부분은 서버가 중개되어 올경우 주소
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log('클라이언트 연결', ip)

        // on 메소드는 클라이언트로 부터 받는 event
        ws.on('message', (message) => {
            console.log(message)
        })
        ws.on('error', (error) => {
            console.error(error)
        })
        ws.on('close', () => {
            clearInterval(ws.interval)
            console.log('클라이언트 연결 해제')
        })

        // send 메소드는 클라이언트로 보내는 event
        // interval을 주면 interval 마다 데이터를 전s송
        const interval = setInterval(() => {
            // ws.CONNECTING, ws.OPEN, ws.CLOSING, ws.CLOSED 네가지의 상태가 있음
            // ws.OPEN 일때만 데이터의 교환이 이루어져야함, 아니면 error 발생
            // 때문에 ws.OPEN 상태인지 검사하는 과정이 필요함
            if(ws.readyState === ws.OPEN){
                ws.send('서버에서 클라이언트로 전송')
            }
        }, 3000)
        // websocket 객체에 interval을 저장(연결 해제시 interval을 삭제해 줘야함)
        // 여기서 삭제를 하지않으면 유저에게 계속해서 데이터를 보내주게되어 데이터 누수가 일어남
        ws.interval = interval
})
}

export default webSocket