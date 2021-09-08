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

router.route('/')
	.post(upload.single('image'), ImageUpload.uploadImage, ReviewCtrl.apiPostReview)
	.get(ReviewCtrl.apiGetReviews)

router.route('/:reviewId')
	.get(ReviewCtrl.apiGetReview)
	.put(ReviewCtrl.apiPutReview)

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
