import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Notice } from '../models/index.js'


const router = new express.Router()

router.post('/', async (req, res, next) => {

	try {
        const notice = await Notice.create({
            ...req.body
        })
		return res.status(201).json({ notice })
	} catch (e) {
		console.error(e)
		next(new Error('공지사항 등록에 실패했습니다.'))
	}
})

router.get('/', authMiddleware(true), async (req, res, next) => {
	try {
        const notices = await Notice.find({})
		return res.status(201).json({ notices })
	} catch (e) {
		console.error(e)
		next(new Error('공지사항 불러오기에 실패했습니다.'))
	}
})

export default router