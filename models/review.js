import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
	},
	book: {
		type: Number,
		ref: 'Book',
		immutable: true,
	},
	comments: {
		type: [commentSchema],
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

class Review {
	static processLikesInfo = (review, userId) => {
		review = review.toJSON()
		review.myLike = review.liked_users.includes(userId)
		delete review.liked_users
		return review
	}

	getMyLike(userId) {
		return this.liked_users.includes(userId)
	}

	get likes() {
		return this.liked_users.length
	}
}

reviewSchema.loadClass(Review)

export default mongoose.model('Review', reviewSchema)
