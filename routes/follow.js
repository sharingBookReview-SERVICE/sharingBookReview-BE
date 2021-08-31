import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import { Follow, User, Alert } from '../models/index.js'
import mongoose from 'mongoose'


const router = new express.Router()

// todo 함수나 static으로 밑의 4개 합쳐보기
// 팔로잉 목록 조회(나의)

const selectedProperties = '_id level nickname profileImage'

/**
 * All routes in the module requires login.
 */
router.use(authMiddleware(true))

/**
 * Get all users whom userId follows.
 * @param userId {ObjectId}
 * @returns {Promise<Document[]>}
 */
const getFollowingUsers = async (userId) => {
	if (!mongoose.isValidObjectId(userId))
		throw { message: '유효하지 않은 user ID 입니다.', status: 400 }

	const follows = await Follow.find({ sender: userId }).populate({
		path: 'receiver',
		select: selectedProperties,
	})

	return follows.map((follow) => follow.receiver)
}

/**
 * Get all users who follow userId.
 * @param userId {ObjectId}
 * @returns {Promise<Document[]>}
 */
const getFollowers = async (userId) => {
	if (!mongoose.isValidObjectId(userId))
		throw { message: '유효하지 않은 user ID 입니다.', status: 400 }

	const follows = await Follow.find({ receiver: userId }).populate({
		path: 'sender',
		select: selectedProperties,
	})

	return follows.map((follow) => follow.sender)
}

/**
 * Returns array of users whom I follow.
 */
router.get('/followingList', async (req, res, next) => {
    try {
        const { _id: userId } = res.locals.user

        const followingList = await getFollowingUsers(userId)
        return res.json({ followingList })
    } catch (e) {
        console.error(e)
        return next(new Error('내가 팔로우중인 유저의 목록 불러오기를 실패했습니다.'))
    }
})

/**
 * Returns array of users who follow me.
 */
router.get('/followerList', async (req, res, next) => {
    try {
        const { _id: userId } = res.locals.user
        const followerList = await getFollowers(userId)

        return res.json({ followerList })
    } catch (e) {
        console.error(e)
        return next(new Error('나를 팔로우중인 유저의 목록 불러오기를 실패했습니다.'))
    }
})

/**
 * Returns array of users whom user in parameter follow.
 */
router.get('/followingList/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params
        const followingList = await getFollowingUsers(userId)

        return res.json({ followingList })
    } catch (e) {
        console.error(e)
        return next(new Error('해당 유저가 팔로우 중인 유저의 목록 불러오기를 실패했습니다.'))
    }
})

/**
 * Returns array of users who follow user in parameter.
 */
router.get('/followerList/:userId', authMiddleware(true), async (req, res, next) => {
    try{
        const { userId } = req.params
        const followerList = await getFollowers(userId)

        return res.json({followerList})
    }catch(e){
		console.error(e)
        return next(new Error('해당 유저를 팔로우 중인 유저의 목록 불러오기를 실패했습니다.'))
    }
})

// 팔로우 하기, 팔로우 취소
router.put('/:userId', async (req, res, next) => {
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
        if(status === true){
            const alert = new Alert({
                type: 'follow',
                sender,
            })
            await User.findByIdAndUpdate(receiver, {
                check_alert: true,
                $push: {
                    alerts: alert,
                },
            })
        }

        const followings = await Follow.find({sender}).populate({path: 'receiver', select: 'level profileImage _id nickname'})
        for (let following of followings){
            followingList.push(following.receiver)
        }

        return res.json({status, followingList})
    } catch(e){
        return next(new Error('팔로우를 실패했습니다.'))
    }

})

// 나를 팔로우 하는 사람 삭제, 관계 취소
router.put('/delete/:userId', async (req, res, next) => {
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