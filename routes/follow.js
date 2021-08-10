import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Follow, User } from '../models/index.js'

const router = new express.Router()

// 팔로잉 목록 조회
router.get('/', async (req, res, next) => {

})

// 팔로우 목록 조회
router.get('/', async (req, res, next) => {

})

// switch follow
router.put('/:userId', authMiddleware, async (req, res, next) => {
    const { _id : sender } = res.locals.user
    const { userId : receiver } = req.params
    try{
        let status
    const follow = await Follow.findOne({sender, receiver})

    if(follow){
        await follow.delete()
        status = false
    } else{
        await Follow.create({
            sender,
            receiver
        })
        status = true
    }
    
    const followingCount = (await Follow.find({sender})).length
    const followerCount = (await Follow.find({receiver})).length

    await User.findByIdAndUpdate(sender, {followingCount})
    await User.findByIdAndUpdate(receiver, {followerCount})
    return res.json({status})
    } catch(e){
        return next(new Error('팔로우를 실패했습니다.'))
    }
    
})

export default router