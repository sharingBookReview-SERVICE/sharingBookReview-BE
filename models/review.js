import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose
import { commentSchema } from './comment.js'
import { KoreaTime } from './utilities.js'

const reviewSchema = new Schema({
	user: { type: Types.ObjectId, ref: 'User', immutable: true },
	book: { type: Number, ref: 'Book', immutable: true },
	comments: [commentSchema],
	quote: String,
	content: String,
	image: String,
	hashtags: [String],
	created_at: { type: Date, default: Date.now },
	liked_users: { type: [Types.ObjectId], ref: 'User' },
	likeCount: { type: Number, default: 0 },
	commented_users: { type: [Types.ObjectId], ref: 'User' },
})

KoreaTime(reviewSchema)

class Review {
	static processLikesInfo = (review, userId) => {
		review = review.toJSON()

		review.myLike = Boolean(
			review.liked_users.filter((_user) => {
				return String(_user) === String(userId)
			}).length
		)
		delete review.liked_users
		return review
	}

	getMyLike(userId) {
		return this.liked_users.includes(userId)
	}
}

reviewSchema.pre('save', function () {
	this.likeCount = this.liked_users.length
})

reviewSchema.loadClass(Review)

export default model('Review', reviewSchema)
