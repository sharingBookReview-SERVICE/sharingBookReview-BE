import mongoose from 'mongoose'

const date = new Date()
const changesIndexSchema = new mongoose.Schema({
	isbn: Number,
	created_at: {
		type: Object,
		default: date,
	},
})

export default mongoose.model('ChangesIndex', changesIndexSchema)