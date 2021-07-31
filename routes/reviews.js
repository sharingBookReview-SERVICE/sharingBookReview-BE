import express from 'express'
import { Book, Review } from '../models/index.js'
import saveBook from './controllers/save_book.js'
import searchBooks from './controllers/searchbooks.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
	const { bookId } = req.params
	// const { userId } = req.locals.user
	const { quote, content, hashtags, image } = req.body
	const { isbn } = req.body.book

	if (bookId !== isbn)
		return next(
			new Error('URL 상의 책 정보와 실제 책의 정보가 일치하지 않습니다.')
		)

	// Check if the book is saved on DB
	let book = await Book.findById(bookId)

	if (!book) {
		try {
			const [searchResult] = await searchBooks('isbn', isbn)
			book = await saveBook(searchResult)
		} catch (e) {
			console.error(e)
			return next(new Error('책 정보 저장을 실패했습니다.'))
		}
	}

	try {
		const review = await Review.create({ ...req.body, bookId })
		await Book.findByIdAndUpdate(bookId, {
			$push: { reviews: review._id },
		})
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 작성을 실패했습니다.'))
	}

	return res.sendStatus(200)

	// try {
	// 	const searchList = await searchBooks('isbn', bookId)
	// 	saveBooks(searchList[0], bookId)
	// 	const review = new Review({
	// 		// userId,
	// 		bookId,
	// 		quote,
	// 		content,
	// 		hashtags,
	// 		image,
	// 	})
	// 	await review.save()
	// 	await Book.findByIdAndUpdate(bookId, { $push: { reviews: review._id } })
	//
	// 	return res.sendStatus(201)
	// } catch (e) {
	// 	console.error(e)
	// 	return next(new Error('리뷰 작성을 실패했습니다.'))
	// }
})

router.get('/', async (req, res) => {
	const { bookId } = req.params

	const reviewList = await Review.findById({ bookId })

	return res.json({ reviewList })
})

router.get('/:reviewId', async (req, res) => {
	const { bookId, reviewId } = req.params

	const review = await Review.findById(reviewId)

	return res.json({ review })
})

router.put('/:reviewId', async (req, res) => {
	const { bookId, reviewId } = req.params
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
	const { bookId, reviewId } = req.params

	await Review.findByIdAndDelete(reviewId)

	return res.sendStatus(202)
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router