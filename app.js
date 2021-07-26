import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = new express()

app.set('port', process.env.PORT)

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})