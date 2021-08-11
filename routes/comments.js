// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment, User } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router({ mergeParams: true })

router.post('/', authMiddleware, async (req, res, next) => {
	const userId = res.locals.user._id
	const { reviewId } = req.params
	const { content } = req.body

	try {
		if (!(await Review.findById(reviewId)))
			return next(new Error('존재하지 않는 리뷰입니다.'))
	} catch (e) {
		console.error(e)
		return next(new Error('댓글이 작성될 리뷰의 조회를 실패했습니다.'))
	}

    try{
        const { comments } = await Review.findById(reviewId)
        let isGetExp = false
        if(comments.length === 0){
            await User.getExpAndLevelUp(userId, "firstComment")
            isGetExp = true
        } else{
            for (let comment of comments){

                if(String(userId) === String(comment.user)){
                    isGetExp = true
                    break
                }
        }
        if(!isGetExp){await User.getExpAndLevelUp(userId, "firstComment")}
    }
        
    }catch(e){
        console.error(e)
		return next(new Error('별점 등록에 실패했습니다.'))
    }

	try {
		const comment = new Comment({ content, user: userId })

        // if(!isGetExp){ comment.getExpUser.push(comment._id)}
        // console.log(comment)

		await Review.findByIdAndUpdate(reviewId, {
			$push: {
				comments: comment,
			},
		})

		return res.status(201).json({ comment })
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 작성을 실패했습니다.'))
	}
})

router.patch('/:commentId', authMiddleware, async (req, res, next) => {
	const userId = res.locals.user._id
	const { reviewId, commentId } = req.params
	const { content } = req.body

	try {
		const review = await Review.findById(reviewId)
		const comment = review.comments.id(commentId)

		if (!comment) return next(new Error('수정하려는 댓글이 존재하지 않습니다.'))

		if (String(comment.user) !== String(userId)) return next(new Error('댓글 작성자와 토큰에 담긴 사용자의 정보가 일치하지 않습니다.'))

		comment.content = content

		await review.save()

		return res.status(200).json({ comment })
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 수정을 실패했습니다.'))
	}
})

router.delete('/:commentId', authMiddleware, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { reviewId, commentId } = req.params
	try {
		const review = await Review.findById(reviewId)
		const comment = review.comments.id(commentId)

		if (!comment) return next(new Error('삭제하려는 댓글이 존재하지 않습니다.'))
		if (String(comment.user) !== String(userId)) return next(new Error('댓글 작성자와 토큰에 담긴 사용자의 정보가 일치하지 않습니다.'))

		await review.comments.pull(commentId)
		await review.save()

		return res.sendStatus(204)
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 삭제를 실패했습니다.'))
	}
})

export default router
