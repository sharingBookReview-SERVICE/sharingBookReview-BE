import { Book, Collection } from '../models/index.js'

export default class tagController {
	static async updateTopTags() {
		console.log('updateTopTags 를 실행합니다.')
		try {
			const updatedBooks = await tagController.#getUpdatedBooks()
			const updatedTags = await tagController.#updateTopTags(updatedBooks)
			const numOfUpdatedTags = await tagController.#updateTagCollection(updatedTags)
			console.log(`updateTopTags 가 성공적으로 완료되었으며, 총 ${numOfUpdatedTags} 개의 태그가 생성 또는 수정되었습니다.`)
		} catch (err) {
			console.error(err)
		}
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

	/**
	 * Update tag collection's contents field with books having the tag in its topTags field.
	 * @param tags {string[]}
	 * @returns {Promise<number>} Number of tag documents that successfully updated.
	 */
	static async #updateTagCollection(tags) {
		const promises = tags.map(async tag => {
			const tagDocument = { name: tag, type: 'tag' }
			const collection = await Collection.findOne(tagDocument) ?? await Collection.create(tagDocument)
			const booksContainingTag = await Book.find({ topTags: tag })
			collection.contents = booksContainingTag.map((book) => {
				return { book: book.isbn }
			})
			return collection.save()
		})
		const result = await Promise.allSettled(promises)
		return result.filter(res => res.status === 'fulfilled').length
	}
}
