import mongoose from 'mongoose'
import { commentSchema } from './comment.js'
import moment from 'moment'

const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); 
const collectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['tag', 'custom', 'best', 'genre'],
		required: true,
		immutable: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
	},
	contents: [{
		book: {
			type: String,
			ref: 'Book',
			required: true,
			alias: 'isbn',
		},
		book_description: String,
	}],
	image: String,
	description: String,
	comments: [commentSchema],
	liked_users: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
	created_at : {
		type: String,
		default: date,
		immutable: true
	},
	commented_users:{
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	}
})

export default mongoose.model('Collection', collectionSchema)