import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

const date = new Date()
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
		type: Object,
		default: date,
		immutable: true
	},
	commented_users:{
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	}
})

export default mongoose.model('Collection', collectionSchema)