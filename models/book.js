import mongoose from 'mongoose'
import { ChangesIndex } from './index.js'

const bookSchema = new mongoose.Schema(
	{
		_id: {
			type: Number,
			required: true,
			alias: 'isbn',
			min: 1000000000000,
			max: 9999999999999,
		},
		title: String,
		link: String,
		image: String,
		author: String,
		price: Number,
		discount: Number,
		publisher: String,
		description: String,
		pubdate: Date,
		reviews: {
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
			ref: 'Review',
		},
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

export default mongoose.model('Book', bookSchema)
