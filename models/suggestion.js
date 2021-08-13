import mongoose from 'mongoose'

const date = new Date()
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
		type: Object,
		default: date,
		immutable: true,
	},
})

export default mongoose.model('Suggestion', suggestionSchema)