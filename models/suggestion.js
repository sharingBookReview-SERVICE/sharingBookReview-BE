import mongoose from 'mongoose'
import { KoreaTime } from './utilities.js'

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
		type: Date,
		default: Date.now,
		immutable: true,
	},
})

KoreaTime(suggestionSchema)

export default mongoose.model('Suggestion', suggestionSchema)