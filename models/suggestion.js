import mongoose from 'mongoose'
import moment from 'moment'

const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); 
const suggestionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
		required: true,
	},
	content: {
		type: String,
	},
	created_at: {
		type: String,
		default: date,
		immutable: true,
	},
})

export default mongoose.model('Suggestion', suggestionSchema)