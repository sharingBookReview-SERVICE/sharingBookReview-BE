import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

const collectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['tag'],
	},
	books: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Book',
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	comments: {
		type: [commentSchema]
	},
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