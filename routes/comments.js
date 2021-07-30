import express from 'express'
import { Review, Comment } from '../models/index.js'

const router = new express.Router({ mergeParams: true })

const { bookId, reviewId } = req.params

router.post('/', async (req, res, next) => {
	try {
		const review = Review.findById(reviewId).exec()

		if (!review) return next(new Error('존재하지 않는 리뷰 아이디입니다.'))

	} catch (e) {

	}
	return res.sendStatus(201)
})

router.patch('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

router.delete('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

export default router
