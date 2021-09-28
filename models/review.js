// noinspection JSUnresolvedVariable

import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose
import { commentSchema } from './comment.js'
import { Book, User } from './index.js'
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

		review.myLike = review.liked_users.some((_user) => String(_user) === String(userId))
		delete review.liked_users
		return review
	}

	getMyLike(userId) {
		return this.liked_users.includes(userId)
	}

    static bookmarkInfo = async function (review, userId) {
        if(review instanceof mongoose.Model){
            review = review.toJSON()
        }
        const { bookmark_reviews } = await User.findById(userId)
        review.bookmark = bookmark_reviews.includes(review._id);
        return review
    }
}

reviewSchema.pre('save', function (next) {
	this.likeCount = this.liked_users.length
	return next()
})

reviewSchema.pre('save', async function () {
	await Book.findByIdAndUpdate(this.book, {
		$set: { updateOnTag: true }
	})
})

reviewSchema.loadClass(Review)

export default model('Review', reviewSchema)
