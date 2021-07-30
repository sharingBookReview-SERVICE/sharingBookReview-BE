// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		const comment = Comment.create(req.body)

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

router.patch('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

router.delete('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

export default router
