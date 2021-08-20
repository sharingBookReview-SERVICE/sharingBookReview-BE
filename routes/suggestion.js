import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Suggestion, User } from '../models/index.js'

const router = new express.Router()

router.post('/', authMiddleware, async (req, res, next) => {
	try {
		const { _id: user } = res.locals.user

		const suggestion = await Suggestion.create({ user, ...req.body })

		return res.status(201).json({ suggestion })
	} catch (e) {
		console.error(e)
		next(new Error('건의 사항 등록에 실패했습니다.'))
	}
})

export default router