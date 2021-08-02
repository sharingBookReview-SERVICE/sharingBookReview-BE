import express from 'express'
import { Review } from '../models/index.js'

const router = new express.Router()
    router.get('/', async (req, res, next) => {
        try {
			const feeds = await Review.find({}).populate('book').sort('-created_at')

			return res.json({ feeds })
		} catch (err) {
			console.error(err)
			return next(err)
		}
})



export default router