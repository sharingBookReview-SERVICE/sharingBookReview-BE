/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import { Book, ChangesIndex, Collection } from '../models/index.js'
import schedule from 'node-schedule'
import mongoose from 'mongoose'
/**
 * Returns unique isbns which have changed after the last run.
 * Marks returned documents' indexed property as true, so it can be deleted later.
 * @returns {Promise<Set<Number>>}
 */
const getChanges = async () => {

	const changes = await ChangesIndex.find()

	return new Set(changes.map(change => change.isbn))
}

/**
 * 1. Execute callback every minute.
 * @type {Job}
 */
const job = schedule.scheduleJob('30 * * * * *', async () => {
	// 2. Get set of isbn which have changed after last execution.
	const changedISBNs = await getChanges()

	// Indexing-needed-tag-based-collection
	const changedTags = new Set()
	// 3. Clear ChangeIndexes table
	// 3.1. In case of addition to the table while executing the function above, use indexed property to only delete appropriate ones.

	// 4. Find corresponding book documents by set of isbn and populate reviews.
	const books = await Book.find({
		_id: {
			$in: [...changedISBNs],
		},
	}).populate('reviews')

	// 5. Traverse the books
	// noinspection ES6MissingAwait
	for (const book of books) {
		// 6. Get array of all the tags of all the reviews of a book
		const allTags = book.reviews.reduce((acc, review) => {
			return [...acc, ...review.hashtags]
		}, [])

		// Unique values of tag array
		const uniqueTags = [...new Set(allTags)]

		// Get top 10 tags
		book.topTags = uniqueTags
			.map((tag) => {
				// Traverse the set of tags of the book and map it to pairs of tag's name and its number of occurrence in array of all tags of the book.
				return {
					name: tag,
					occurrence: allTags.filter((_tag) => _tag === tag).length,
				}
			})
			.sort((a, b) => b.occurrence - a.occurrence)
			.slice(0, 9)
			.map((tag) => tag.name)

		// Update Collection
		for (const _tag of book.topTags) {
			const tag =
				(await Collection.findOne({ name: _tag, type: 'tag' })) ??
				(await Collection.create({ name: _tag, type: 'tag' }))
			tag.books.addToSet(mongoose.Types.ObjectId(book._id))
			await tag.save()
		}

		await book.save()
	}

	await ChangesIndex.deleteMany()
})

