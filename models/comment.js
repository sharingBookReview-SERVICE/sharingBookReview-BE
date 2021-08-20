import mongoose from 'mongoose'
import { KoreaTime } from './utilities.js'

const commentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	content: String,
	created_at: {
		type: Date,
		default: Date.now,
	}
    
})

KoreaTime(commentSchema)

export default mongoose.model('Comment', commentSchema)
export { commentSchema }