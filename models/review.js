import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		immutable: true,
	},
	book: {
		type: mongoose.Types.ObjectId,
		ref: 'Book',
		immutable: true,
	},
	quote: String,
	content: String,
	image: String,
	hashtags: [String],
	created_at: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	liked_users: {
		type: [mongoose.Types.ObjectId],
		ref: 'User',
	},
})

export default mongoose.model('Review', reviewSchema)
