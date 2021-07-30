// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		const comment = await Comment.create(req.body)

		await Review.findByIdAndUpdate(reviewId, {
			$push: {
				comments: comment,
			},
		})

		return res.sendStatus(201)
	} catch (e) {
		return next(new Error('댓글 작성을 실패했습니다.'))
	}
})

router.patch('/:commentId', async (req, res, next) => {
	const { reviewId, commentId } = req.params
	const { content } = req.body

	// try {
	// 	const review = await Review.findById(reviewId)
	//
	// 	await review.commnets.id(commentId).content = content
	// 	await review.save()
	//
	// 	return res.sendStatus(200)
	// } catch (e) {
	// 	console.error(e)
	// 	return next(e)
	// }

	try {
		await Review.updateOne({
		_id: reviewId, 'comments._id': commentId
		}, {
			$set: {
				'comments.$.content': content
			}
		})
	} catch (e) {
		console.error(e)
		return next(e)
	}
})

router.delete('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

export default router
