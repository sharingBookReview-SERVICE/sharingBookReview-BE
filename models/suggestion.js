import { Schema, Types, model } from 'mongoose'
import { KoreaTime } from './utilities.js'

const suggestionSchema = new Schema({
	user: { type: Types.ObjectId, ref: 'User', immutable: true, required: true,	},
	content: String ,
	created_at: { type: Date, default: Date.now, },
})

KoreaTime(suggestionSchema)

export default model('Suggestion', suggestionSchema)