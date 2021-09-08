// /api/books/:bookId/reviews/:reviewId/
import express from 'express'
import { Review, Comment, User, Alert } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import { validateId } from '../controllers/utilities.js'

const router = new express.Router({ mergeParams: true })

/**
 * todo 현재 리뷰 커멘트를 컬렉션 커멘트 라우터로도 활용할 수 있게 변경하기
 * 라우터의 호출 주소만 바꾸고 (collections/collectionId/comments 해도 여기로 와지게
 * 여기서 리뷰인지 컬렉션인지 분간하기 (mergeParams 로 받은게 reviewId 인지 collectionId 인지 확인하면 됨)
 *
 */
router.use(authMiddleware(true))

/**
 * Create a comment on review
 */
router.post('/', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { reviewId } = req.params
	const { content } = req.body

	const review = await validateId(Review, reviewId)

    try{
        const { commented_users } = review
        
        const canGetExp = commented_users.some((_id) => String(_id) === String(userId))
        if(!canGetExp){
            await User.getExpAndLevelUp(userId, "firstComment")
            commented_users.push(userId)
            await review.save()
        }

    } catch(e){
        console.error(e)
		return next(new Error('경험치 등록을 실패헀습니다.'))
    }
    
    try{
        if(String(userId) !== String(review.user)){
            const alert = new Alert({
                type: 'comment',
                sender: userId,
                reviewId,
                comment: content
            })
            await User.findByIdAndUpdate(review.user, {
                check_alert: true,
                $push: {
                    alerts: alert,
                },
            })
        }
        const comment = new Comment({ content, user: userId })

		await Review.findByIdAndUpdate(reviewId, {
			$push: {
				comments: comment,
			},
		})

		return res.status(201).json({ comment})
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 작성을 실패했습니다.'))
	}
})

/**
 * Update comment's content by comment ID
 */
router.patch('/:commentId', async (req, res, next) => {
	const userId = res.locals.user._id
	const { reviewId, commentId } = req.params
	const { content } = req.body

	try {
		const review = await validateId(Review, reviewId)
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

/**
 * Delete a comment by comment ID
 */
router.delete('/:commentId', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { reviewId, commentId } = req.params
	try {
		const review = await validateId(Review, reviewId)
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
