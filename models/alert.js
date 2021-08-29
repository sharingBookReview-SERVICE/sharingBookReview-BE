import mongoose from 'mongoose'
import { KoreaTime } from './utilities.js'

const alertSchema = new mongoose.Schema({
	type: {
		type: String,
        enum: ['like', 'comment', 'follow'],
	},
    sender: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
	reviewId:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Review',
		immutable: true,
    },
    comment: String,
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

KoreaTime(alertSchema)

export default mongoose.model('Alert', alertSchema)
export { alertSchema }