import mongoose from 'mongoose'
import config from '../config.js'
import Book from './book.js'
import Review from './review.js'
import Comment from './comment.js'
import User from './user.js'
import ChangesIndex from './changes_index.js'
import Collection from './collection.js'

config()

const connect = () => {
	if (process.env.NODE_ENV !== 'production') {
		mongoose.set('debug', true)
	}
}

mongoose.set('toJSON', { virtuals: true })

let uri = 'mongodb://localhost:27017/admin'
if (process.env.NODE_ENV === 'production') {
    uri = `mongodb+srv://bns-admin:${process.env.MONGO_ATLAS_PASSWORD}@bns.00wfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
}
mongoose.connect(
    uri,    
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

export { Book, Review, Comment, User, ChangesIndex, Collection }
