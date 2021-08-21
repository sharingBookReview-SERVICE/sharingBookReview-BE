import mongoose from 'mongoose'
import { commentSchema } from './comment.js'
import { KoreaTime } from './utilities.js'

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
	likeCount: {
		type: Number,
		default: 0,
	},
	created_at: {
		type: Date,
		default: Date.now,
		immutable: true
	},
	commented_users:{
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
})

KoreaTime(collectionSchema)

collectionSchema.pre('save', function () {
	this.likeCount = this.liked_users.length
})

export default mongoose.model('Collection', collectionSchema)