import mongoose from 'mongoose'

const date = new Date()
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
		type: Object,
		default: date,
	},
})

export default mongoose.model('Follow', followSchema)