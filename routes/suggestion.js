import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Suggestion, User } from '../models/index.js'

const router = new express.Router()

router.post('/followingList', authMiddleware, async (req, res, next) => {
    
})

export default router