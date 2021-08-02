// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'
import { authMiddleware } from '../middleware/auth_middleware.js'


const router = new express.Router({ mergeParams: true })

router.post('/', authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId } = req.params
    const { content } = req.body
    if(!await Review.findById(reviewId))return next(new Error('존재하지 않는 리뷰입니다.'))

	try {
		// todo: Is there a way not to create the comments collection when creating a comment document?
		const comment = new Comment({content, user: userId})

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

router.patch('/:commentId',authMiddleware, async (req, res, next) => {
    const userId = res.locals.user._id
	const { reviewId, commentId } = req.params
	const { content } = req.body

	try {
        const comment = await Review.findOne({
                _id: reviewId,
				'comments._id': commentId,
        })
        console.log("0", comment)
        console.log("1", comment.user)
        console.log("2", userId)
        if (comment === null) return next(new Error("댓글이 존재하지 않습니다."))
        if (comment.user !== userId) return next(new Error("본인이 아닙니다."))

		await comment.updateOne(			
			{
				$set: {
					'comments.$.content': content,
				},
			}
		)

		return res.sendStatus(200)
	} catch (e) {
		return next(new Error('댓글 수정을 실패했습니다.'))
	}
})

router.delete('/:commentId', authMiddleware, async (req, res, next) => {
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
		return next(new Error('댓글 삭제를 실패했습니다.'))
	}
})

export default router
