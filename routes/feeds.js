import express from 'express'
import { Review } from '../models/index.js'

const router = new express.Router()

router.get('/', async (req, res, next) => {
	try {
		const feeds = await Review.find({}).populate('book').sort('-created_at')

		return res.json({ feeds })
	} catch (err) {
		return next(new Error('피드를 불러오는데 실패했습니다.'))
	}
})

export default router