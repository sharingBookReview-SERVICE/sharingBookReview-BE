import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Follow, User } from '../models/index.js'

const router = new express.Router()

// 팔로잉 목록 조회
router.get('/followingList', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user

        const followList = await Follow.find({sender : userId}).populate({path : 'receiver', select : 'level _id nickname'})
        const followingList = followList.map((follow) => {
            return follow.receiver
        })
        res.json({followingList})
    }catch(e){
        return next(new Error('팔로잉 리스트 불러오기를 실패했습니다.'))
    }
})

// 팔로워 목록 조회
router.get('/followerList', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user

        const followList = await Follow.find({receiver : userId}).populate({path : 'sender', select : 'level _id nickname'})
        const followerList = followList.map((follow) => {
            return follow.sender
        })
        res.json({followerList})
    }catch(e){
        return next(new Error('팔로잉 리스트 불러오기를 실패했습니다.'))
    }
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