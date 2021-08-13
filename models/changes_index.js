import mongoose from 'mongoose'
import moment from 'moment'

const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); 
const changesIndexSchema = new mongoose.Schema({
	isbn: Number,
	created_at: {
		type: String,
		default: date,
	},
}) 

export default mongoose.model('ChangesIndex', changesIndexSchema)