// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'


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
        const review = await Review.findById(reviewId)
        const comment = review.comments.id(commentId)
        // todo : 나중에 밑에 녀석으로 해보기($표시)
        // const review = await Review.find({comments: { _id : commentId }})

        if (comment === null) return next(new Error("댓글이 존재하지 않습니다."))
        if (String(comment.user) !== String(userId)) return next(new Error("본인이 아닙니다."))
        comment.content = content

		await review.save()

		return res.sendStatus(200)
	} catch (e) {
		return next(new Error('댓글 수정을 실패했습니다.'))
	}
})

router.delete('/:commentId', authMiddleware, async (req, res, next) => {
    const { _id: userId } = res.locals.user
	const { reviewId, commentId } = req.params
	try {
        const review = await Review.findById(reviewId)
		const comment = review.comments.id(commentId)
        
        if (comment === null) return next(new Error("댓글이 존재하지 않습니다."))
		if (String(comment.user) !== String(userId)) return next(new Error('댓글 작성자와 현재 로그인된 사용자가 다릅니다.'))
		
        await review.comments.pull(commentId)
		await review.save()

        return res.sendStatus(200)        
	} catch (e) {
		return next(new Error('댓글 삭제를 실패했습니다.'))
	}
})



export default router
