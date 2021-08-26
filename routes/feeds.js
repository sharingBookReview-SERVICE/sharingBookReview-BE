import express from 'express'
import { Follow, Review, User } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router()

router.get('/', authMiddleware(false), async (req, res, next) => {
	/**
	 * Number of reviews to send per request.
	 * @type {number}
	 */
	const SCROLL_SIZE = 10
	const userId = res.locals.user?._id
	const { lastItemId } = req.query

	try {
		// 0. Declare constants to query.

		const user = await User.findById(userId)
		/**
		 * Array of ObjectId of read reviews of user. If user is null (i.e. not logged in) assigned as undefined.
		 *  @type {ObjectId[]}
		 */
		const readReviews = user?.read_reviews.map((element) => element._id)
		/**
		 * Query statement for reviews: unread and created within one week
		 *  @type {Object}
		 */
		const query = {
			_id: { $nin: readReviews },
			created_at: { $gte: new Date() - 1000 * 60 * 60 * 24 * 7 },
		}

		// 1. Return recent unread reviews of following users.

		/**
		 * Array of user IDs that the the user in parameter is following.
		 * @type {ObjectId[]}
		 */
		const followees = (await Follow.find({ sender: userId })).map(
			(follow) => follow.receiver
		)
		/**
		 * Array of reviews of following users
		 *  @type {Document[]}
		 */
		const followingReviews = await Review.find({
			...query,
			user: { $in: [...followees, userId] },
		})
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })

		// If no documents found with query, continue until next if statement. This keep goes on.
		if (followingReviews.length) return res.json(followingReviews)

		// 2. Return trending reviews (reviews with high trending point, in other words, recent review with lots of likes)

		const trendingReviews = {}
		if (trendingReviews.length) return json(trendingReviews)

		// 3. Return all recent unread reviews regardless of following.

		const recentReviews = await Review.find(query)
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })``

		if (recentReviews.length) return res.json(recentReviews)

		// If no reviews are found by all three queries.
		return res.sendStatus(204)

		let reviews
		let result

		if (!lastItemId) {
			reviews = await Review.find()
				.sort('-created_at')
				.limit(SCROLL_SIZE)
				.populate({ path: 'user', select: '_id profileImage nickname' })
				.populate({ path: 'book', select: '_id title author' })
		} else {
			reviews = await Review.find()
				.sort('-created_at')
				.where('_id')
				.lt(lastItemId)
				.limit(SCROLL_SIZE)
				.populate({ path: 'user', select: '_id profileImage nickname' })
				.populate({ path: 'book', select: '_id title author' })
		}

		if (userId) {
			result = reviews.map((review) =>
				Review.processLikesInfo(review, userId)
			)
            result = await Promise.all(
				result.map((review) =>
					Review.bookmarkInfo(review, userId)
				)
			)
			result = await Promise.all(
				result.map((review) =>
					Follow.checkFollowing(review, userId, review.user)
				)
			)
		} else {
			result = reviews
		}
		return res.json(result)
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}
})

/**
 * Route patching read reviews
 * @name patch/:reviewId
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.patch('/:reviewId', authMiddleware(true), async (req, res, next) => {
	const { _id: userId } = res.locals.user
	/** @type {ObjectId}
	 * @description Review ID that user has read.
	 */
	const { reviewId } = req.params

	/** @type {Date}
	 * @description Created date of review.     */
	const createdAt = (await Review.findById(reviewId)).created_at

	// Find user by ID and push to read_reviews array.
	try {
		const user = await User.findById(userId)
		user.read_reviews.addToSet({
			_id: reviewId,
			created_at: createdAt,
		})
		await user.save()

		return res.sendStatus(204)
	} catch (e) {
		console.error(e)
		return next(new Error('읽음 확인을 실패했습니다.'))
	}
})

export default router
