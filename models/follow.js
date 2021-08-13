import mongoose from 'mongoose'
import moment from 'moment'

const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); 
const followSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    created_at: {
		type: String,
		default: date,
	},
})

export default mongoose.model('Follow', followSchema)