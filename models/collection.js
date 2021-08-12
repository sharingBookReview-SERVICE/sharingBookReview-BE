import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

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
			type: Number,
			ref: 'Book',
			required: true,
			alias: 'isbn',
			min: 1000000000000,
			max: 9999999999999,
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
		type: Date,
		default: Date.now,
		immutable: true
	}
})

export default mongoose.model('Collection', collectionSchema)