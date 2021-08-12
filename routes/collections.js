import express from 'express'
import { Collection } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
const router = new express.Router()

router.post('/', authMiddleware, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	try {
		const collection = await Collection.create({ ...req.body, type: 'custom', user: userId })

		return res.status(201).json({collection})
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 작성을 실패했습니다.'))
	}
})

// Get all collections
router.get('/', authMiddleware, async (req, res, next) => {
	try {
		// query = { name, type }
		const collections = await Collection.find(req.query).populate('contents.book', '-reviews')

		return res.json({ collections })
	} catch (e) {
		console.error(e)
		return next(new Error('콜렉션 불러오기를 실패했습니다.'))
	}
})

export default router