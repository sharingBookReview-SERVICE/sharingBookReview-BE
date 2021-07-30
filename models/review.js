import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
	},
	bookId: {
		type: Number,
		ref: 'Book',
		immutable: true,
	},
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
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
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
})

export default mongoose.model('Review', reviewSchema)
