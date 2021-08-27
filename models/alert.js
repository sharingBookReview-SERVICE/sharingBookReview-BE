import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
	type: {
		type: String,
        enum: ['like', 'comment', 'follow'],
	},
    writer: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
	reviewId:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Review',
		immutable: true,
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Collection',
		immutable: true,
    },
    is_read:{
        type: Boolean,
        default: false
    },
	created_at: {
		type: Date,
		default: Date.now,
	}
    
})

export default mongoose.model('Alert', alertSchema)
export { alertSchema }