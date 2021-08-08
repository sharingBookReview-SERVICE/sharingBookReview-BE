/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import { Book, ChangeIndex } from '../models/index.js'
import schedule from 'node-schedule'

/**
 * Returns unique isbns which have changed after the last run.
 * Marks returned documents' indexed property as true, so it can be deleted later.
 * @returns {Promise<Set<Number>>}
 */
const getChanges = async () => {

	const changes = await ChangeIndex.find({})

	await Promise.allSettled([
		...changes.map(change => {
			change.indexed = true
			return change.save()
		})])

	return new Set(changes.map(change => change.isbn))
}

const job = schedule.scheduleJob('0 * * * * *', async () => {
// Get list of unique isbns which have changed
	const changedISBNs = await getChanges()
// Clear ChangeIndexes table
	await ChangeIndex.deleteMany({ indexed: true })
// Books to be indexed
	const books = await Book.find({
		_id: {
			$in: [...changedISBNs],
		},
	}).populate('reviews')

	books.forEach(async (book) => {
		// Array of all tags used to describe the book in its reviews
		const allTags = book.reviews.reduce((acc, review) => {
			return [...acc, ...review.hashtags]
		}, [])

		// Unique values of tag list
		const uniqueTags = [...new Set(allTags)]

		// List of a tag name and its occurrence pairs
		book.topTags = uniqueTags
		.map((tag) => {
			return {
				name: tag,
				occurrence: allTags.filter((_tag) => _tag === tag).length,
			}
		})
		.sort((a, b) => b.occurrence - a.occurrence)
		.slice(0, 10)
		.map((tag) => tag.name)

		await book.save()
	})
})

