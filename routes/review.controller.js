import { Book, Review, User } from '../models/index.js'
import searchBooks from '../controllers/searchbooks.js'
import { saveBook } from '../controllers/utilities.js'

export default class ReviewController {
	static async apiPostReview(req, res, next) {
		const { _id: userId } = res.locals.user
		const { bookId } = req.params
		const { quote, content } = req.body
		const hashtags = JSON.parse(req.body.hashtags)
		// res.locals.url: user input image
		// req.body.imageUrl: image from unsplash
		const image = res.locals?.url ?? req.body.imageUrl

		try {
			const book = await Book.findById(bookId)

			if (!book) {
				const [searchResult] = await searchBooks('isbn', bookId)
				await saveBook(searchResult)
			}

			const review = await Review.create({ quote, content, hashtags, image, book: bookId, user: userId })
			book.reviews.push(review._id)
			await book.save()

			const result = await review.populate('book').populate({
				path: 'user',
				select: 'level nickname profileImage',
			}).execPopulate()

			await User.getExpAndLevelUp(userId, 'review')

			return res.json({ review: result })
		} catch (err) {
			console.error(err)
			return next({ message: '리뷰 작성을 실패했습니다.', status: 500 })
		}
	}

	static async apiGetReviews(req, res, next) {
		const { _id: userId } = res.locals.user
		const { bookId } = req.params

		try {
			const { reviews } = await Book.findById(bookId)
				.select('reviews')
				.populate({
					path: 'reviews', populate: 'user',
					options: { sort: { created_at: -1 } },
				})

			const reviewsWithLikesInfo = reviews.map(review => Review.processLikesInfo(review, userId))

			return res.json({ reviews: reviewsWithLikesInfo })
		} catch (err) {
			console.error(err)
			return next({ message: '리뷰 불러오기를 실패했습니다.', status: 500 })
		}
	}
}
