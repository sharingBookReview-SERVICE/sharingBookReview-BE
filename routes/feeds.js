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
		// 0. Declare constants to query.

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

		// 1. Return recent unread reviews of following users.

		/** @type {ObjectId[]}
		 * @description Array of user IDs that the the user in parameter is following. */
		const followees = (await Follow.find({ sender: userId })).map((follow) => follow.receiver)

		/** @type {Document[]}
		 * @description Array of reviews of following users */
		const followingReviews = await Review.find({
			...query,
			user: { $in: followees },
		})
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)

		// If following reviews are used up (already read or no new ones) continue to next if statement
		if (followingReviews.length) {
			return res.json({ feeds: followingReviews })
		}

		// 2. Return recent unread reviews of any users.

		/** @type {Document[]}
		 *  @description Unread reviews of user within one week */
		const unreadReviews = await Review.find(query)
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)

		// If unread reviews are used up (already read or no new ones) continue to last res.json()
		if (unreadReviews.length) {
			return res.json({ feeds: unreadReviews })
		}

		// 3. Return random best reviews.
		// todo: 필요한지 회의하기

		res.json({ message: '보여줄거 다보여줬슴당' })
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}
})

const getFollowingReviews = async (userId) => {}

export default router
