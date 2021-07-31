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
		const review = await Review.create({ ...req.body, bookId })
		await book.reviews.push(review._id)
		await book.save()
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 작성을 실패했습니다.'))
	}

	return res.sendStatus(200)
})

router.get('/', async (req, res) => {
	const { bookId } = req.params

	const reviews = await Book.findById(bookId)
		.select('reviews')
		.populate({ path: 'reviews', options: { sort: { created_at: -1 } } })

	return res.json(reviews)
})

router.get('/:reviewId', async (req, res) => {
	const { reviewId } = req.params

	const review = await Review.findById(reviewId).populate('bookId')

	return res.json({ review })
})

router.put('/:reviewId', async (req, res) => {
	const { reviewId } = req.params
	const { quote, content, hashtags, image } = req.body

	await Review.findByIdAndUpdate(reviewId, {
		quote,
		content,
		hashtags,
		image,
	})

	return res.sendStatus(202)
})

router.delete('/:reviewId', async (req, res) => {
	const { reviewId } = req.params

	// By using Document instead of Query (or Model),
	// pre deleteOne middleware can bind the document as this
	const review = await Review.findById(reviewId)
	await review.deleteOne()

	return res.sendStatus(202)
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router
