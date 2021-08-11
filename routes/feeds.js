import express from 'express'
import { Review } from '../models/index.js'

const router = new express.Router()

router.get('/', async (req, res, next) => {
	const SCROLL_SIZE = 10
	const { lastItemId } = req.body

	const userId = 'temp' //todo 로그인 안 된 상태에서 어떻게 처리할지 정해야함
	// Set page as 1 if not specified by the client

	try {
		const reviews = await Review.find({}).populate('book user').sort('-created_at')

		const result = reviews.map(review => Review.processLikesInfo(review, userId))
		return res.json(result)

	} catch (err) {
		return next(new Error('피드를 불러오는데 실패했습니다.'))
	}
})

export default router