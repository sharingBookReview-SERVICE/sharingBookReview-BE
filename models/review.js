import mongoose from 'mongoose'
import Comment, { commentSchema } from './comment.js'

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

/**
 * On deleting a review, the function subsequently deletes the comments subdocument array in it.
 * @returns {Promise<void>}
 */
async function deleteCascadeComments() {
	const commentIds = this.comments.map((comment) => comment._id)
	await Comment.deleteMany({
		_id: {
			$in: commentIds,
		},
	})
}

reviewSchema.pre('deleteOne', { document: true }, deleteCascadeComments)

export default mongoose.model('Review', reviewSchema)
