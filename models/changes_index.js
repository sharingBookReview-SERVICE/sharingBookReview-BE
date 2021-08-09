import mongoose from 'mongoose'

const changesIndexSchema = new mongoose.Schema({
	isbn: Number,
	created_at: {
		type: Date,
		default: Date.now,
	},
})

export default mongoose.model('ChangesIndex', changesIndexSchema)