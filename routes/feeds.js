import express from 'express'
import { Review } from '../models/index.js'

const router = new express.Router()

router.get('/', async (req, res, next) => {
	const SCROLL_SIZE = 10
	const { lastItemId } = req.query

	try {
		let reviews

		if (!lastItemId) {
			reviews = await Review.find()
			.sort('-created_at')
			.limit(SCROLL_SIZE)
			.populate('book user')
		} else {
			reviews = await Review.find()
			.sort('-created_at')
			.where('_id')
			.lt(lastItemId)
			.limit(SCROLL_SIZE)
			.populate('book user')
		}

		return res.json({reviews})
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}


	// const userId = 'temp' //todo 로그인 안 된 상태에서 어떻게 처리할지 정해야함
	// try {
	// 	const reviews = await Review.find({}).populate('book user').sort('-created_at')
	//
	// 	const result = reviews.map(review => Review.processLikesInfo(review, userId))
	// 	return res.json(result)
	//
	// } catch (err) {
	// 	return next(new Error('피드를 불러오는데 실패했습니다.'))
	// }
})

export default router