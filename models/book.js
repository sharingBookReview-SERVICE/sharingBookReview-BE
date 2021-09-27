import mongoose from 'mongoose'

const { Schema, Types, model } = mongoose
import { ChangesIndex } from './index.js'

const bookSchema = new Schema(
	{
		_id: { type: Number, alias: 'isbn', required: true },
		title: String,
		link: String,
		image: String,
		author: String,
		price: Number,
		discount: Number,
		publisher: String,
		description: String,
		pubdate: Date,
		reviews: { type: [Types.ObjectId], default: [], ref: 'Review' },
		topTags: [String],
		updateOnTag: { type: Boolean, default: false },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

bookSchema.post('save', async function() {
	const updatedBookISBN = this.isbn
	await ChangesIndex.create({ isbn: updatedBookISBN })
})

export default model('Book', bookSchema)
