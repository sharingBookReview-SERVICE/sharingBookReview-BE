/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import schedule from 'node-schedule'
import indexTopTags from './index_top_tags.js'
import getTrendingReviews from './get_trending_reviews.js'

// per minute '0 * * * * *'
schedule.scheduleJob('20 * * *', async () => {
	console.log('스케줄 시작')
	await indexTopTags()
	await getTrendingReviews()
})
