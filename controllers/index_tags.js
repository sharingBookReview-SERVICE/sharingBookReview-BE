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

})

// Test code for debugging
debugger
const input = await Book.findOne()
await ChangeIndex.create({ isbn: input._id })
/************************************************/

const changedISBNs = await getChanges()
await ChangeIndex.deleteMany({ indexed: true })
// Books to be indexed
const books = await Book.find({
	_id: {
		$in: [...changedISBNs],
	},
}).populate('reviews')

books.forEach((book) => {
	const uniqueTags = new Set()
	book.reviews.forEach((review) => {
		uniqueTags.add(...review.hashtags)
	})
	console.log(uniqueTags)
})