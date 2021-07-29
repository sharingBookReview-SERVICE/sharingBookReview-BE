import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connect = () => {
	if (process.env.NODE_ENV !== 'production') {
		mongoose.set('debug', true)
	}
}

mongoose.connect(
	'mongodb://localhost:27017/admin',
	{
		dbName: 'bns',
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) console.error('몽고디비 연결 오류', err)
		else console.log('몽고디비 연결 성공')
	}
)

mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err)
	connect()
})

connect()