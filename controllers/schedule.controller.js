import indexTopTags from './tag.controller.js'
import getTrendingReviews from './get_trending_reviews.js'

const DAY = 1000 * 60 * 60 * 24
setInterval(async () => {
	console.log('스케쥴 시작')
	await indexTopTags()
	await getTrendingReviews()
}, DAY)