import mongoose from 'mongoose'
import { ChangeIndex } from './index.js'

const bookSchema = new mongoose.Schema(
	{
		_id: {
			type: Number,
			alias: 'isbn',
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

class Book {
	/**
	 *
	 * @returns {[string]}
	 */
	get topTags() {
		const topTags = '1234'
		return topTags
	}
}

bookSchema.loadClass(Book)

/**
 * Saves updated book's isbn in ChangeIndex for tag indexing.
 */
bookSchema.post('save', async function () {
	const updatedBookISBN = this.isbn
	await ChangeIndex.create({ isbn: updatedBookISBN })
})

export default mongoose.model('Book', bookSchema)
