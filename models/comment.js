import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose
import { KoreaTime } from './utilities.js'

const commentSchema = new Schema({
	user: { type: Types.ObjectId, ref: 'User', },
	content: String,
	created_at: { type: Date, default: Date.now, },
})

KoreaTime(commentSchema)

export default model('Comment', commentSchema)
export { commentSchema }