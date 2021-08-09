import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Book from './book.js'
import Review from './review.js'
import Comment from './comment.js'
import User from './user.js'
import ChangesIndex from './changes_index.js'

dotenv.config()

const connect = () => {
	if (process.env.NODE_ENV !== 'production') {
		mongoose.set('debug', true)
	}
}

mongoose.set('toJSON', { virtuals: true })

mongoose.connect(
	'mongodb+srv://BNS:test@bns.00wfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
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

export { Book, Review, Comment, User, ChangesIndex }
