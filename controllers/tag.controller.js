import { ChangesIndex, Book, Review, Collection } from '../models/index.js'

/**
 * Returns set of isbns which changed since last run
 * @returns {Promise<Set<number>>}
 */
const getChangedISBNs = async () => {
	const changes = await ChangesIndex.find()

	return new Set(changes.map((change) => change.isbn))
}
/**
 * Returns set of tags from given array of books (=isbns).
 * @param isbnArr {number[]}
 * @returns {Promise<Set<string>>}
 */
const getChangedTags = async (isbnArr) => {
	const result = new Set()

	/**
	 *  Books to be updated on their topTags property.
	 * @type {Document[]}
	 */
	const books = await Book.find({
		_id: {
			$in: isbnArr,
		},
	})
		.select('reviews')
		.populate({ path: 'reviews', select: 'hashtags' })

	for (const book of books) {
		/**
		 * Array of all tags from hashtags of reviews of book
		 * @type {string[]}
		 */
		const allTags = book.reviews.reduce((acc, review) => {
			// If hashtags is empty, continue without change
			if (!review.hashtags) return acc
			return [...acc, ...review.hashtags]
		}, [])
		/**
		 * Array of unique tags from allTags.
		 * @type {string[]}
		 */
		const uniqueTags = [...new Set(allTags)]

		// Update topTags property of book.
		book.topTags = uniqueTags
			.map((tag) => {
				return {
					name: tag,
					occurrence: allTags.filter((_tag) => _tag === tag).length,
				}
			})
			.sort((a, b) => b.occurrence - a.occurrence)
			.slice(0, 9)
			.map((tag) => tag.name)

		await book.save()
		result.add(...book.topTags)
	}

	return result
}
/**
 * Update or Create tag collection.
 * @param tag {string}
 * @returns {Promise<void>}
 */
const updateCollection = async (tag) => {
	if (!tag) return

	const collection =
		// Check if collection exists. Otherwise create new one.
		(await Collection.findOne({ name: tag, type: 'tag' })) ??
		(await Collection.create({ name: tag, type: 'tag' }))

	/**
	 * Books having the tag in topTags property.
	 * @type {Document[]}
	 */
	const books = await Book.find({ topTags: tag })
	collection.contents = books.map((book) => {
		return { book: book.isbn }
	})
	console.log(`${collection.name} 컬렉션이 업데이트 되었습니다.`)
	await collection.save()
}
const indexTopTags = async () => {
	try {
		console.log('indexTopTags 함수가 실행됩니다.')
		const changedISBNs = await getChangedISBNs()
		const changedTags = await getChangedTags([...changedISBNs])
		changedTags.forEach(await updateCollection)
		await ChangesIndex.deleteMany()
	} catch (e) {
		console.error(e)
	}
}

export default class tagController {
	static async updateTopTags() {
		console.log('updateTopTags 를 실행합니다.')
		try {
			const updatedBooks = await tagController.#getUpdatedBooks()
			const updatedTags = await tagController.#updateTopTags(updatedBooks)
			await tagController.#updateTagCollections(updatedTags)
		} catch (err) {
			console.error(err)
		}
		console.log('updateTopTags 를 종료합니다.')
	}

	/**
	 * Returns array of isbn of which updateOnTag field is true. And set updateOnTag field to false.
	 * @returns {Promise<Document<>[]>} Array of mongodb documents with id and reviews field.
	 */
	static async #getUpdatedBooks() {
		const books = await Book.find({ updateOnTag: true }, { reviews: 1, topTags: 1 }).populate({
			path: 'reviews',
			select: 'hashtags',
		})
		await Book.updateMany({ updateOnTag: true }, { updateOnTag: false })
		return books
	}

	/**
	 * For each book in books, calculate most used hashtags of its reviews. Then save them as topTags field in the book.
	 * @param books Array of book documents.
	 * @returns {Promise<string[]>} Array of updated tags.
	 */
	static async #updateTopTags(books) {
		const updatedTags = new Set()
		const promises = books.map(book => {
			const allTagsOfOneBook = book.reviews.reduce((acc, review) => {
				if (!review.hashtags) return acc
				return [...acc, ...review.hashtags]
			}, [])
			const uniqueTagsOfOneBook = [...new Set(allTagsOfOneBook)]
			book.topTags = getMostUsedTagsForOneBook(allTagsOfOneBook, uniqueTagsOfOneBook)
			updatedTags.add(...uniqueTagsOfOneBook)
			return book.save()
		})
		await Promise.allSettled(promises)

		return [...updatedTags]

		function getMostUsedTagsForOneBook(allTags, uniqueTags) {
			return uniqueTags.map((tag) => {
				return {
					name: tag,
					occurrence: allTags.filter((_tag) => tag === tag).length,
				}
			}).sort((a, b) => b.occurrence - a.occurrence).slice(0, 9).map((tag) => tag.name)
		}
	}

	static async #updateTagCollections(updatedTags) {

	}
}
