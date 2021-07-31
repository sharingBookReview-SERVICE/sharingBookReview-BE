import express from 'express'
import Review from '../models/review.js'

const router = new express.Router()
    router.get('/', async (req, res) => {
        try {
			const feeds = await Review.find({}).sort('-created_at')

			return res.json({ feeds })
		} catch (err) {
			console.error(err)
			return next(err)
		}
})



export default router