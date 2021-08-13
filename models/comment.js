import mongoose from 'mongoose'

const date = new Date()
const commentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	content: String,
	created_at: {
		type: Object,
		default: date,
	}
    
})

export default mongoose.model('Comment', commentSchema)
export { commentSchema }