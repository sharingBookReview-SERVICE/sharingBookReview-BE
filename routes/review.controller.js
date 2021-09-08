import { Book, Review, User } from '../models/index.js'
import searchBooks from '../controllers/searchbooks.js'
import { saveBook } from '../controllers/utilities.js'
import mongoose from 'mongoose'
import user from '../models/user.js'
const { isValidObjectId } = mongoose

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

			let review = await Review.create({ quote, content, hashtags, image, book: bookId, user: userId })
			book.reviews.push(review._id)
			await book.save()

			review = await review.populate('book').populate({
				path: 'user',
				select: 'level nickname profileImage',
			}).execPopulate()

			await User.getExpAndLevelUp(userId, 'review')

			review = Review.processLikesInfo(review, userId)
			review = Review.bookmarkInfo(review, userId)

			return res.status(201).json({ review })
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
				.select('reviews -_id')
				.populate({
					path: 'reviews',
					populate: {
						path: 'user',
						model: 'User',
						options: { sort: { created_at: -1 } },
					},
				})
			const reviewsWithLikesInfo = reviews.map(review => Review.processLikesInfo(review, userId))
			return res.json({ reviews: reviewsWithLikesInfo })
		} catch (err) {
			console.error(err)
			return next({ message: '전체 리뷰 불러오기를 실패했습니다.', status: 500 })
		}
	}

	static async apiGetReview(req, res, next) {
		const { _id: userId } = res.locals.user
		const { reviewId } = req.params

		try {
			let review = await Review.findById(reviewId)
				.populate('book')
				.populate({
					path: 'user',
					select: 'level nickname profileImage',
				})
			const { comments } = review

			review = Review.processLikesInfo(review, userId)
			review = Review.bookmarkInfo(review, userId)

			review.comments = (await Promise.allSettled(comments.map(async (comment) => {
				const user = await User.findById(comment.user).select('_id level nickname')
				comment = comment.toJSON()
				comment.user = user
				return comment
			}))).map((p) => p.value)

			return res.json({ review })
		} catch (err) {
			console.error(err)
			return next({ message: '개별 리뷰 불러오기를 실패했습니다.', status: 500 })
		}
	}

	static async apiPutReview(req, res, next) {
		const { _id: userId } = res.locals.user
		const { reviewId } = req.params
		const { quote, content, hashtags } = req.body

		try {
			let review = await Review.findById(reviewId)

			if (!review) return next({ message: '존재하지 않는 리뷰 아이디 입니다.', status: 400 })
			if (String(review.user) !== String(userId)) return next({
				message: '현 사용자와 리뷰 작성자가 일치하지 않습니다.',
				status: 403,
			})

			review = await review.updateOne(req.body, { new: true })
			review = Review.processLikesInfo(review, userId)
			review = Review.bookmarkInfo(review, userId)

			return res.json({ review })
		} catch (err) {
			console.error(err)
			return next({ message: '리뷰 수정을 실패했습니다.', status: 500 })
		}
	}

	static async apiDeleteReview(req, res, next) {
		const { _id: userId } = res.locals.user
		const { reviewId } = req.params

		try {
			const review = await Review.findById(reviewId)

			if (!review) return next({ message: '존재하지 않는 리뷰 아이디 입니다.', status: 400 })
			if (String(review.user) !== String(userId)) return next({
				message: '현 사용자와 리뷰 작성자가 일치하지 않습니다.',
				status: 403,
			})

			await review.deleteOne()

			return res.sendStatus(202)
		} catch (err) {
			console.error(err)
			return next({ message: '리뷰 삭제를 실패했습니다.', status: 500 })
		}
	}

	static async bookmarkReview(req, res, next) {
		const { _id: userId } = res.locals.user
		const { reviewId } = req.params

		if (!isValidObjectId(reviewId)) return next({ message: '잘못된 리뷰 아이디입니다.', status: 400 })

		try {
			const user = await User.findById(userId)
			const { bookmark_reviews } = user
			let bookmarkStatus = bookmark_reviews.includes(reviewId)

			bookmarkStatus ? bookmark_reviews.pull(reviewId) : bookmark_reviews.push(reviewId)
			await user.save()

			bookmarkStatus = !bookmarkStatus
			console.log(bookmarkStatus)

			return res.status(201).json({ status: bookmarkStatus })
		} catch (err) {
			console.error(err)
			return next({ message: '북마크 등록 / 해제를 실패했습니다.', status: 500 })
		}
	}
}
