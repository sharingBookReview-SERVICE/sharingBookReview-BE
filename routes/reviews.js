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
	.delete(ReviewCtrl.apiDeleteReview)

//todo: 하단의 두 라우터도 컨트롤러로 옮기기
router.put('/:reviewId/likes', await likeUnlike(Review, 'review'))

router.put('/:reviewId/bookmark', ReviewCtrl.bookmarkReview)

export default router
