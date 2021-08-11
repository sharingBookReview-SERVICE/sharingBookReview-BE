import express from 'express'
import { Collection } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
const router = new express.Router()

router.post('/', authMiddleware ,async (req, res) => {
	const { _id: userId } = res.locals.user

	try {
		const collection = await Collection.create({
			...req.body,
			type: 'custom',
			user: userId,
		})

		return res.json({collection})

	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 작성을 실패했습니다.'))
	}
})

router.get('/', (req, res) => {

})

export default router