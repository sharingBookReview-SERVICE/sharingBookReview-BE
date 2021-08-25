import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router()

router.post('/', authMiddleware(false), async (req, res, next) => {


    return res.status(201).json({})
})

export default router