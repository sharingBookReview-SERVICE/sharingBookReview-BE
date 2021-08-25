/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import { Book, ChangesIndex, Collection } from '../models/index.js'
import schedule from 'node-schedule'
import index_top_tags from './index_top_tags.js'
/**
 * Returns set of isbn which have changed after the last run.
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
	await index_top_tags()
})

