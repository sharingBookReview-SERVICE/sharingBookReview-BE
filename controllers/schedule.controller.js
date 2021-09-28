import getTrendingReviews from './get_trending_reviews.js'
import tagController from './tag.controller.js'

const DAY = 1000 * 60 * 60 * 24
await tagController.updateTopTags()
setInterval(async () => {
	console.log('스케쥴 시작')
	await tagController.updateTopTags()
	await getTrendingReviews()
}, DAY)