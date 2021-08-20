import mongoose from 'mongoose'
import { KoreaTime } from './utilities.js'

const changesIndexSchema = new mongoose.Schema({
	isbn: Number,
	created_at: {
		type: Date,
		default: Date.now,
	},
})

KoreaTime(changesIndexSchema)

export default mongoose.model('ChangesIndex', changesIndexSchema)