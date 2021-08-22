import { Schema, Types, model } from 'mongoose'
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
		reviews: { type: [Types.ObjectId], default: [], ref: 'Review', },
		topTags: [String],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

// class Book {
// }
//
// bookSchema.loadClass(Book)

/**
 * Saves updated book's isbn in ChangeIndex for tag indexing.
 */
bookSchema.post('save', async function () {
	const updatedBookISBN = this.isbn
	await ChangesIndex.create({ isbn: updatedBookISBN })
})

export default model('Book', bookSchema)
