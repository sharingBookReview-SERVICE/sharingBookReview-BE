import { Review, Trend } from '../models/index.js'

const DAY = 1000 * 60 * 60 * 24

/**
 * Index recent reviews and create Trend document.
 * @async
 */
const getTrendingReviews = async () => {

	/**
	 * Max past dates to calculate trending reviews
	 * @type {number}
	 */
	const MAX_DATES = 7
	/**
	 * Recent reviews with at least one like.
	 * @type {Document[]}
	 */
	const recentReviews = await Review.find({
		created_at: { $gte: new Date() - DAY * MAX_DATES },
		likeCount: { $gte: 1 },
	})

	/**
	 * Array of trendPoint and review Id paris.
	 * @type {{trendPoint: number, _id: ObjectId}[]}
	 */
	const trendingReviews = recentReviews
		.map((review) => {
			const { _id, likeCount, created_at } = review
			/**
			 * Dates elapsed since each review is posted.
			 * If written within 24hrs, elapsedDay is set to 1 to avoid divide by zero error.
			 * @type {number}
			 */
			const elapsedDay = Math.floor((new Date() - created_at) / DAY) + 1
			/**
			 * Point based on likeCount decreases relative to elapsed day
			 * @type {number}
			 */
			const trendPoint = likeCount / elapsedDay

			return { _id, trendPoint }
		})
		.sort((a, b) => b.trendPoint - a.trendPoint)

	const result = await Trend.create({trendingReviews})
	console.log('result', result)
}

export default getTrendingReviews