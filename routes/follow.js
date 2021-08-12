import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Follow, User } from '../models/index.js'

const router = new express.Router()
// const today = new Date()
// const date = {
//     year : today.getFullYear(),
//     month : today.getMonth(),
//     ddate : today.formatDate(),
//     day : today.getDate(),
// }
const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const date = event.toLocaleDateString(undefined, options)

// 팔로잉 목록 조회
router.get('/followingList', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user

        const followList = await Follow.find({sender : userId}).populate({path : 'receiver', select : '_id level nickname profileImage'})
        const followingList = followList.map((follow) => {
            return follow.receiver
        })
        res.json({followingList,date})
    }catch(e){
        return next(new Error('팔로잉 리스트 불러오기를 실패했습니다.'))
    }
})

// 팔로워 목록 조회
router.get('/followerList', authMiddleware, async (req, res, next) => {
    try{
        const { _id : userId } = res.locals.user

        const followList = await Follow.find({receiver : userId}).populate({path : 'sender', select : '_id level nickname profileImage'})
        const followerList = followList.map((follow) => {
            return follow.sender
        })
        res.json({followerList,date})
    }catch(e){
        return next(new Error('팔로잉 리스트 불러오기를 실패했습니다.'))
    }
})

// 팔로우 하기, 팔로우 취소
router.put('/:userId', authMiddleware, async (req, res, next) => {
    const { _id : sender } = res.locals.user
    const { userId : receiver } = req.params
    let status
    const followingList = []

    try{
        const follow = await Follow.findOne({sender, receiver})

        if(follow){
            await follow.delete()
            status = false
            User.deleteExp(receiver, "follow")
        } else{
            await Follow.create({
                sender,
                receiver
            })
            status = true
            await User.getExpAndLevelUp(receiver, "follow")
        }

        const followings = await Follow.find({sender}).populate({path: 'receiver', select: 'level profileImage _id nickname'})
        for (let following of followings){
            followingList.push(following.receiver)
        }
        
        const followingCount = (await Follow.find({sender})).length
        const followerCount = (await Follow.find({receiver})).length

        await User.findByIdAndUpdate(sender, {followingCount})
        await User.findByIdAndUpdate(receiver, {followerCount})
        return res.json({status, followingList})
    } catch(e){
        return next(new Error('팔로우를 실패했습니다.'))
    }
    
})

// 나를 팔로우 하는 사람 삭제, 관계 취소
router.put('/delete/:userId', authMiddleware, async (req, res, next) => {
    const { _id : receiver } = res.locals.user
    const { userId : sender } = req.params
    let status
    const followerList = []

    try{
        const follow = await Follow.findOne({sender, receiver})

        if(!follow){
            next(new Error("팔로우가 되어있지 않습니다."))
        }
        await follow.delete()
        User.deleteExp(receiver, "follow")

        const followers = await Follow.find({receiver}).populate({path: 'sender', select: 'level profileImage _id nickname'})
        for (let follower of followers){
            followerList.push(follower.sender)
        }
        
        const followingCount = (await Follow.find({sender})).length
        const followerCount = (await Follow.find({receiver})).length

        await User.findByIdAndUpdate(sender, {followingCount})
        await User.findByIdAndUpdate(receiver, {followerCount})

        return res.json({followerList})

    } catch(e){
        return next(new Error('팔로우 삭제를 실패했습니다.'))
    }
    
})

export default router