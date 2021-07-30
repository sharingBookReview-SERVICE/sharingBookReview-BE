import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
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
})

class Book {
	/**
	 *
	 * @returns {[string]}
	 */
	get topTags() {
		const topTags = "1234"
		return topTags
	}
}

bookSchema.loadClass(Book)

export default mongoose.model('Book', bookSchema)
