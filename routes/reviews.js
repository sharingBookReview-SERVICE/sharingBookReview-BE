import express from 'express'
import { Book, Review } from '../models/index.js'
import saveBook from './controllers/save_book.js'
import searchBooks from './controllers/searchbooks.js'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router({ mergeParams: true })

router.post('/', authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { bookId } = req.params
	// const { userId } = req.locals.user

	// Check if the book is saved on DB
	const book = await Book.findById(bookId)

	if (!book) {
		try {
			const [searchResult] = await searchBooks('isbn', bookId)
			await saveBook(searchResult)
		} catch (e) {
			return next(new Error('책 정보 저장을 실패했습니다.'))
		}
	}

	try {
		const review = await Review.create({ ...req.body, book: bookId, user: userId })
		await book.reviews.push(review._id)
		await book.save()
	} catch (e) {
		return next(new Error('댓글 작성을 실패했습니다.'))
	}

	return res.sendStatus(200)
})

router.get('/', async (req, res, next) => {
	const { bookId } = req.params

	try {
		const reviews = await Book.findById(bookId)
			.select('reviews')
			.populate({
				path: 'reviews',
				options: { sort: { created_at: -1 } },
			})
		return res.json(reviews)
	} catch (e) {
		return next(new Error('리뷰 목록 가져오기를 실패했습니다.'))
	}
})

router.get('/:reviewId', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		const review = await Review.findById(reviewId).populate('book')
		return res.json({ review })
	} catch (e) {
		return next(new Error('리뷰 조회를 실패했습니다.'))
	}
})

router.put('/:reviewId', authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
	const { quote, content, hashtags, image } = req.body

	try {
		const review = await Review.findById(reviewId)
        if (review == null)return next(new Error('리뷰가 존재하지 않습니다.'))
        if(String(review.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
        await review.updateOne({
			quote,
			content,
			hashtags,
			image,
		})

		return res.sendStatus(202)
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

router.put('/:reviewId/likes', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { reviewId } = req.params

	try {
		const review = await Review.findById(reviewId)
		if (!review) return next(new Error('존재하지 않는 리뷰입니다.'))
		review.getMyLike(userId) ? review.liked_users.pull(userId) : review.liked_users.push(userId)
		await review.save()
	} catch (e) {
		return next(new Error('좋아요/좋아요취소 를 실패했습니다.'))
	}
})

export default router
