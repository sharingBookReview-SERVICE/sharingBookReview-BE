import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/index.js'

dotenv.config()

const app = new express()

app.set('port', process.env.PORT)

app.use(router)

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router doesn't exist`)
	error.status = 404
	next(error)
})

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})