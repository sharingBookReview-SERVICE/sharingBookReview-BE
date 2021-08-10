import mongoose from 'mongoose'

const followSchema = new mongoose.Schema({
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    created_at: {
		type: Date,
		default: Date.now,
	},
})

export default mongoose.model('Follow', followSchema)