import express from 'express'
import { Book, Review } from '../models/index.js'
import saveBook from './controllers/save_book.js'
import searchBooks from './controllers/searchbooks.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
	const { bookId } = req.params
	// const { userId } = req.locals.user

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
		const review = await Review.create({ ...req.body, book: bookId })
		await book.reviews.push(review._id)
		await book.save()
	} catch (e) {
		console.error(e)
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
		console.error(e)
		return next(new Error('리뷰 목록 가져오기를 실패했습니다.'))
	}
})

router.get('/:reviewId', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		const review = await Review.findById(reviewId).populate('book')
		return res.json({ review })
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 조회를 실패했습니다.'))
	}
})

router.put('/:reviewId', async (req, res, next) => {
	const { reviewId } = req.params
	const { quote, content, hashtags, image } = req.body

	try {
		await Review.findByIdAndUpdate(reviewId, {
			quote,
			content,
			hashtags,
			image,
		})

		return res.sendStatus(202)
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 수정을 실패했습니다.'))
	}
})

router.delete('/:reviewId', async (req, res) => {
	const { reviewId } = req.params

	// By using Document instead of Query (or Model),
	// pre deleteOne middleware can bind the document as this
	try {
		const review = await Review.findById(reviewId)
		await review.deleteOne()

		return res.sendStatus(202)
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 삭제를 실패했습니다.'))
	}
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router
