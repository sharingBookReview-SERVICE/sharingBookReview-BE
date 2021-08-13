import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Follow, User } from '../models/index.js'

const router = new express.Router()

// 팔로잉 목록 조회
router.get('/followingList', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user

        const followList = await Follow.find({follower : userId}).populate({path : 'followee', select : '_id level nickname profileImage'})
        const followingList = followList.map((follow) => {
            return follow.followee
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

        const followList = await Follow.find({followee : userId}).populate({path : 'follower', select : '_id level nickname profileImage'})
        const followerList = followList.map((follow) => {
            return follow.follower
        })
        res.json({followerList})
    }catch(e){
        return next(new Error('팔로잉 리스트 불러오기를 실패했습니다.'))
    }
})

// switch follow
// todo like랑 비슷하게 refactoring
router.put('/:userId', authMiddleware, async (req, res, next) => {
    const { _id : follower } = res.locals.user
    const { userId : followee } = req.params
    let status
    const followingList = []

    try{
        const follow = await Follow.findOne({follower, followee})

        if(follow){
            await follow.delete()
            status = false
            User.deleteExp(followee, "follow")
        } else{
            await Follow.create({
                follower,
                followee
            })
            status = true
            await User.getExpAndLevelUp(followee, "follow")
        }

        const followings = await Follow.find({follower}).populate({path: 'followee', select: 'level profileImage _id nickname'})
        for (let following of followings){
            followingList.push(following.followee)
        }
        
        const followingCount = (await Follow.find({follower})).length
        const followerCount = (await Follow.find({followee})).length

        await User.findByIdAndUpdate(follower, {followingCount})
        await User.findByIdAndUpdate(followee, {followerCount})
        return res.json({status, followingList})
    } catch(e){
        return next(new Error('팔로우를 실패했습니다.'))
    }
    
})

export default router