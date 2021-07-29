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
	description: String,
	pubdate: Date,
	reviews: {
		type: [mongoose.Schema.Types.ObjectId],
		default: [],
		ref: 'Review'
	}
})

export default mongoose.model('Book', bookSchema)
