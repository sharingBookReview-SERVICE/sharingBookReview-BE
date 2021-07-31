import { Book } from '../../models/index.js'

const saveBook = async (object, bookId) => {
	const newBook = new Book()
	for (const [key, value] of Object.entries(object)) {
		newBook[key] = value
	}
	await newBook.save()
}

export default saveBook
