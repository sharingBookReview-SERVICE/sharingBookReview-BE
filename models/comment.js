import mongoose from 'mongoose'
import moment from 'moment'

const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); 
const commentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	content: String,
	created_at: {
		type: String,
		default: date,
	}
    
})

export default mongoose.model('Comment', commentSchema)
export { commentSchema }