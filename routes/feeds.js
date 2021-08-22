import express from 'express'
import { Follow, Review, User } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router()

router.get('/', authMiddleware(false), async (req, res, next) => {
	/** @type {number}
	 *  @description Number of reviews to send per request */
	const SCROLL_SIZE = 10
	const userId = res.locals.user?._id

	try {
		/** @type {Document}
		 *  @description User document */
		const user = await User.findById(userId)
		/** @type {ObjectId[]}
		 * @description Array of ObjectId of read reviews of user. If user is null (ie.e. not logged in) assigned as undefined. */
		const readReviews = user?.read_reviews.map((element) => elemet.review)
		/** @type {Object}
		 *  @description Query statement for reviews: unread and created within one week */
		const query = {
			_id: { $nin: readReviews },
			created_at: { $gte: new Date() - 1000 * 60 * 60 * 24 * 7 },
		}
		/** @type {Document[]}
		 *  @description Unread reviews of user within one week */
		const feeds = await Review.find(query).
			sort({ created_at: -1 }).
			limit(SCROLL_SIZE)

		return res.json({ feeds })
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}
})

export default router