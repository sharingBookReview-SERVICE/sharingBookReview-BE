// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'

const router = new express.Router({ mergeParams: true })



router.post('/', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		const review = Review.findById(reviewId).exec()

		if (!review) return next(new Error('존재하지 않는 리뷰 아이디입니다.'))

		const comment = new Comment(req.body)

		await review.comments.push(comment)
		await review.save()

		return res.sendStatus(201)
		// todo findByIdAndUpdate(,{$push:}) review 존재하지 않을 때의 에러처리 확인하고 적용하기
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
