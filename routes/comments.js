// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
	const { reviewId } = req.params

	try {
		// todo: Is there a way not to create the comments collection when creating a comment document?
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

	try {
		await Review.updateOne(
			{
				_id: reviewId,
				'comments._id': commentId,
			},
			{
				$set: {
					'comments.$.content': content,
				},
			}
		)

		return res.sendStatus(200)
	} catch (e) {
		console.error(e)
		return next(e)
	}
})

router.delete('/:commentId', async (req, res, next) => {
	const { reviewId, commentId } = req.params

	try {
		await Promise.all([

			// Delete the comment in the comment collection
			Comment.deleteOne({ _id: commentId }),

			// Delete the comment in the review document
			Review.updateOne(
				{ _id: reviewId },
				{
					$pull: {
						comments: { _id: commentId },
					},
				}
			),
		])

		return res.sendStatus(200)
	} catch (e) {
		console.error(e)
		return next(e)
	}
})

export default router
