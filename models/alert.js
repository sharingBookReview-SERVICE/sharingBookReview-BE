import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
	type: {
		type: String,
        enum: ['like', 'comment'],
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
	created_at: {
		type: Date,
		default: Date.now,
	}
    
})

export default mongoose.model('Alert', alertSchema)
export { alertSchema }