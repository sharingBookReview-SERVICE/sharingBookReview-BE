/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import schedule from 'node-schedule'
import indexTopTags from './index_top_tags.js'

schedule.scheduleJob('0 * * * * *', async () => {
	await indexTopTags()
})
