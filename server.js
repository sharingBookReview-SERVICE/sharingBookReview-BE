import './socket.js'
import { server, app } from './app.js'

server.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})