import express from 'express'
import { Book, Review, User } from '../models/index.js'
import { likeUnlike } from '../models/utilities.js'
import saveBook from '../controllers/save_book.js'
import searchBooks from '../controllers/searchbooks.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'

const router = new express.Router({ mergeParams: true })
const upload = multer({
	dest: 'uploads/',
})

router.post('/', authMiddleware, upload.single('image'), ImageUpload.uploadImage, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { bookId } = req.params
	// res.locals가 존재하지 않으면 undefined 반환
	const image = res.locals?.url
	const { quote, content } = req.body
	const hashtags = JSON.parse(req.body.hashtags)

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

    try{
        await User.getExpAndLevelUp(userId, "review")
    }catch (e) {
        return next(new Error('경험치 등록을 실패했습니다.'))
    }

	try {
		const review = await Review.create({
			quote,
			content,
			hashtags,
			image,
			book: bookId,
			user: userId,
		})
		const book = await Book.findById(bookId)

		await book.reviews.push(review._id)
		await book.save()
        
        const result = await Review.findById(review._id).populate('book').populate({path:'user', select:'_id level nickname'})
        

		return res.json({ review: result,})
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰작성을 실패했습니다.'))
	}
    
})

router.get('/', authMiddleware, async (req, res, next) => {
	const { bookId } = req.params
	const { _id: userId } = res.locals.user

	try {
		const { reviews } = await Book.findById(bookId)
			.select('reviews')
			.populate({
				path: 'reviews', populate : 'user',
				options: { sort: { created_at: -1 } },
			})

		/**
		 * Add myLike and likes properties and Delete liked_users property.
		 */
		const result = reviews.map(review => Review.processLikesInfo(review, userId))

		return res.json({reviews: result})
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰 목록 가져오기를 실패했습니다.'))
	}
})

router.get('/:reviewId', authMiddleware ,async (req, res, next) => {
	const { reviewId } = req.params
	const { _id: userId } = res.locals.user

	try {
		let review = await Review.findById(reviewId).populate('book').populate({path:'user', select:'_id level nickname profileImage'})
		const { comments } = review
		
		review = Review.processLikesInfo(review, userId)
		
		review.comments = (await Promise.allSettled(comments.map(async (comment) => {
			const user = await User.findById(comment.user).select('_id level nickname')
			comment = comment.toJSON()
			comment.user = user
			return comment
		}))).map((p) => p.value)

		return res.json({ review })
	} catch (e) {
		return next(new Error('리뷰 조회를 실패했습니다.'))
	}
})

router.put('/:reviewId', authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
	const { quote, content, hashtags } = req.body

	try {
		const targetReview = await Review.findById(reviewId)
        if (targetReview == null)return next(new Error('리뷰가 존재하지 않습니다.'))
        if(String(targetReview.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
        await targetReview.updateOne({
			quote,
			content,
			hashtags,
		})
        const result = await Review.findById(reviewId).populate('book')
		return res.status(202).json({review: result})
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
        console.error(e)
		return next(new Error('리뷰 삭제를 실패했습니다.'))
	}
})

router.put('/:reviewId/likes', authMiddleware, await likeUnlike(Review, 'review'))

export default router
