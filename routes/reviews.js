import express from 'express'
import { Book, Review } from '../models/index.js'
import saveBook from './controllers/save_book.js'
import searchBooks from './controllers/searchbooks.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import reviewImage from './controllers/review_image.js'
const router = new express.Router({ mergeParams: true })
const upload = multer({
    dest: 'uploads/'
})

const processLikesInfo = (review, userId) => {
	review = review.toJSON()
	review.myLike = review.liked_users.includes(userId)
	delete review.liked_users
	return review
}

router.get('/images/:key', reviewImage.getImage)

router.post('/images', upload.single('image'), reviewImage.uploadImage)

router.post('/', authMiddleware, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { bookId } = req.params

	// Check if the book is saved on DB
	const book = await Book.findById(bookId)

	if (!book) {
		try {
			const [searchResult] = await searchBooks('isbn', bookId)
			await saveBook(searchResult)
		} catch (e) {
			console.error(e)
			return next(new Error('책 정보 저장을 실패했습니다.'))
		}
	}

	try {
		const review = await Review.create({
			...req.body,
			book: bookId,
			user: userId,
		})
		await book.reviews.push(review._id)
		await book.save()

		return res.json({ review })
	} catch (e) {
		return next(new Error('댓글 작성을 실패했습니다.'))
	}
})

router.get('/', authMiddleware, async (req, res, next) => {
	const { bookId } = req.params
	const { _id: userId } = res.locals.user

	try {
		const { reviews } = await Book.findById(bookId)
			.select('reviews')
			.populate({
				path: 'reviews',
				options: { sort: { created_at: -1 } },
			})

		/**
		 * Add myLike and likes properties and Delete liked_users property.
		 */
		const result = reviews.map(review => processLikesInfo(review, userId))

		return res.json({review: result})
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 목록 가져오기를 실패했습니다.'))
	}
})

router.get('/:reviewId', authMiddleware ,async (req, res, next) => {
	const { reviewId } = req.params
	const { _id: userId } = res.locals.user

	try {
		const review = await Review.findById(reviewId).populate('book')
		const result = processLikesInfo(review, userId)
		return res.json({ review: result })
	} catch (e) {
		return next(new Error('리뷰 조회를 실패했습니다.'))
	}
})

router.put('/:reviewId', authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
	const { quote, content, hashtags, image } = req.body

	try {
		const targetReview = await Review.findById(reviewId)
        if (targetReview == null)return next(new Error('리뷰가 존재하지 않습니다.'))
        if(String(targetReview.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
        await targetReview.updateOne({
			quote,
			content,
			hashtags,
			image,
		})
        const review = await Review.findById(reviewId)
		return res.status(202).json({review})
	} catch (e) {
		return next(new Error('리뷰 수정을 실패했습니다.'))
	}
})

router.delete('/:reviewId', authMiddleware, async (req, res) => {
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
		return next(new Error('리뷰 삭제를 실패했습니다.'))
	}
})

router.put('/:reviewId/likes', authMiddleware, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { reviewId } = req.params

	try {
		const review = await Review.findById(reviewId)

		if (!review) return next(new Error('존재하지 않는 리뷰입니다.'))

		let message = ''

		if (review.getMyLike(userId)) {
			review.liked_users.pull(userId)
			message = '좋아요 취소를 성공했습니다.'
		} else {
			review.liked_users.push(userId)
			message = '좋아요를 성공했습니다.'
		}
		await review.save()

		return res.json({result: message})
	} catch (e) {
		return next(new Error('좋아요/좋아요취소 를 실패했습니다.'))
	}
})

export default router
