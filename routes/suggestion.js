import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Suggestion, User } from '../models/index.js'

const router = new express.Router()

router.post('/', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user
    
        await Suggestion.create({userId, ...req.body})
        res.json('success')
    }catch(e){
        next(new Error("건의 사항 등록에 실패했습니다."))
    }
    
})

export default router