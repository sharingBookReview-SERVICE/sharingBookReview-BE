import { Router } from 'express'
import { Book, Review, User } from '../models/index.js'
import { likeUnlike } from '../models/utilities.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'
import ReviewCtrl from './review.controller.js'

const router = new Router({ mergeParams: true })
const upload = multer({ dest: 'uploads/' })

router.use(authMiddleware(true))

router.post('/', upload.single('image'), ImageUpload.uploadImage, ReviewCtrl.apiPostReview)

router.get('/', async (req, res, next) => {
	const { bookId } = req.params
	const { _id: userId } = res.locals.user

	try {
		const { reviews } = await Book.findById(bookId)
			.select('reviews')
			.populate({
				path: 'reviews', populate : 'user',
				options: { sort: { created_at: -1 } },
			})

		/**
		 * Add myLike and likes properties and Delete liked_users property.
		 */
		const result = reviews.map(review => Review.processLikesInfo(review, userId))

		return res.json({reviews: result})
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 목록 가져오기를 실패했습니다.'))
	}
})

router.get('/:reviewId', async (req, res, next) => {
	const { reviewId } = req.params
	const { _id: userId } = res.locals.user

	try {
		let review = await Review.findById(reviewId).populate('book').populate({path:'user', select:'_id level nickname profileImage'})
		const { comments } = review

		review = Review.processLikesInfo(review, userId)
        review = await Review.bookmarkInfo(review, userId)

		review.comments = (await Promise.allSettled(comments.map(async (comment) => {
			const user = await User.findById(comment.user).select('_id level nickname')
			comment = comment.toJSON()
			comment.user = user
			return comment
		}))).map((p) => p.value)

		return res.json({ review })
	} catch (e) {
		return next(new Error('리뷰 조회를 실패했습니다.'))
	}
})

router.put('/:reviewId', async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
	const { quote, content, hashtags } = req.body

	try {
		const targetReview = await Review.findById(reviewId)
        if (targetReview == null)return next(new Error('리뷰가 존재하지 않습니다.'))
        if(String(targetReview.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
        await targetReview.updateOne({
			quote,
			content,
			hashtags,
		})
        const result = await Review.findById(reviewId).populate('book').populate({path:'user', select:'_id level nickname profileImage'})
		return res.status(202).json({review: result})
	} catch (e) {
		return next(new Error('리뷰 수정을 실패했습니다.'))
	}
})

router.delete('/:reviewId', async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params

	// By using Document instead of Query (or Model),
	// pre deleteOne middleware can bind the document as this
	try {
		const review = await Review.findById(reviewId)
        if (review == null)return next(new Error('리뷰가 존재하지 않습니다.'))
        if(String(review.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
		await review.deleteOne()

		return res.sendStatus(202)
	} catch (e) {
        console.error(e)
		return next(new Error('리뷰 삭제를 실패했습니다.'))
	}
})

router.put('/:reviewId/likes', await likeUnlike(Review, 'review'))

router.put('/:reviewId/bookmark', authMiddleware(true), async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
    let status

	try {
        let user = await User.findById(userId)
		const { bookmark_reviews } = user

        if(bookmark_reviews.includes(reviewId)){
            bookmark_reviews.pull(reviewId)
            status = false

        }else{
            bookmark_reviews.push(reviewId)
            status = true
        }
        
        await user.save()

		return res.status(202).json({status})
	} catch (e) {
		return next(new Error('북마크 등록을 실패했습니다.'))
	}
})

export default router
