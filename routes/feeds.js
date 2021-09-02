import express from 'express'
import { Follow, Review, User, Trend } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import { showLikeFollowBookMarkStatus } from '../controllers/utilities.js'

const router = new express.Router()

const SCROLL_SIZE = 10

router.get('/', authMiddleware(false), async (req, res, next) => {
	/**
	 * Number of reviews to send per request.
	 * @type {number}
	 */
	const userId = res.locals.user?._id

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
		if (followingReviews.length){
            return res.json(await showLikeFollowBookMarkStatus(followingReviews, userId))
        } 

		// 2. Return trending reviews (reviews with high trending point, in other words, recent review with lots of likes)
		const trend = await Trend.findOne({}, {}, { sort: { created_at: -1 } })
		const trendingReviewIdArr = trend.trendingReviews.map(review => review._id)
		const trendingReviews = await Review.find({
			_id: { $in: trendingReviewIdArr, $nin: readReviews },
		})
			//todo: $sample 넣기
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })

		if (trendingReviews.length) {
            return res.json(await showLikeFollowBookMarkStatus(trendingReviews, userId))
        }
		// 3. Return all recent unread reviews regardless of following.

		const recentReviews = await Review.find(query)
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })

		if (recentReviews.length){
            return res.json(await showLikeFollowBookMarkStatus(recentReviews, userId))
        }
		// 4. If no reviews are found by all three queries.
		return res.sendStatus(204)

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

router.get('/recent', authMiddleware(false), async (req, res, next) => {
    
	const userId = res.locals.user?._id
	const { lastItemId } = req.query

	try {
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

        if(!reviews.length){
            return res.sendStatus(204)
        }

		if (userId) {
			result = await showLikeFollowBookMarkStatus(reviews, userId)
		} else {
			result = reviews
		}
		return res.json(result)
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}
})

export default router
