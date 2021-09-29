import { Router } from 'express'
import { Review } from '../models/index.js'
import { likeUnlike } from '../models/utilities.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ReviewCtrl from './review.controller.js'
import ImageUploadController from '../controllers/image_upload.controller.js'

const router = new Router({ mergeParams: true })
const upload = multer({ dest: 'uploads/' })

router.use(authMiddleware(true))

router.route('/')
	.post(upload.single('image'), ImageUploadController.uploadImage, ReviewCtrl.apiPostReview)
	.get(ReviewCtrl.apiGetReviews)

router.route('/:reviewId')
	.get(ReviewCtrl.apiGetReview)
	.put(ReviewCtrl.apiPutReview)
	.delete(ReviewCtrl.apiDeleteReview)

router.put('/:reviewId/likes', await likeUnlike(Review, 'review'))
router.put('/:reviewId/bookmark', ReviewCtrl.bookmarkReview)

export default router
