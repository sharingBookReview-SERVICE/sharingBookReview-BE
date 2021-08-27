import express from 'express'
import { User, Review, Collection, Follow } from '../models/index.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import authMiddleware from '../middleware/auth_middleware.js'


config()

const router = new express.Router()

const loginRedirectUrl = (token) => {
    if(process.env.NODE_ENV === 'production'){
        return `http://bookdiver.net/logincheck/token=${token}`
    }
    return `http://localhost:3000/logincheck/token=${token}`
}

let logoutRedirectUrl = 'http://localhost:3000'
if(process.env.NODE_ENV === 'production'){
    logoutRedirectUrl = 'http://bookdiver.net'
}

// kakao-login
router.get('/kakao', passport.authenticate('kakao'))

router.get('/kakao/callback', (req, res, next) => {
	passport.authenticate(
		'kakao',
		{
			failureRedirect: '/kakao',
		},
		(err, profile, token) => {
			if (err) return next(new Error('소셜로그인 에러'))
			return res.redirect(loginRedirectUrl(token))
		}
	)(req, res, next)
})

//Google-login
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login'],
	})
)

router.get('/google/callback', (req, res, next) => {
	passport.authenticate(
		'google',
		{ failureRedirect: '/google' },
		(err, user, token) => {
			if (err) return next(new Error('소셜로그인 에러'))
			return res.redirect(loginRedirectUrl(token))
		}
	)(req, res, next)
})

//log-out
router.get('/logout', (req, res, next) => {
	try { 
		req.logout()
		res.redirect(logoutRedirectUrl)

	} catch (e) {
		return next(new Error('로그아웃에 실패했습니다.'))
	}
})

router.use(authMiddleware(true))

// Returns all reviews and collections made by a user(mine)
router.get('/feeds', async (req, res, next) => {
	const { _id: userId } = res.locals.user

	try {
        const user = await User.findById(userId)
		const reviews = await Review.find({user: userId}).populate('book').sort('-created_at')
		const collections = await Collection.find({user: userId}).sort('-created_at')

		return res.json({user, reviews, collections})
	} catch (e) {
		console.error(e)
		return next(new Error('개인 피드 불러오기를 실패했습니다.'))
	}
})
// Returns all reviews and collections made by a user(others)
router.get('/feeds/:userId', async (req, res, next) => {
	const { userId } = req.params
    const { _id : myUserId} = res.locals.user
    
	try {
        let user = await User.findById(userId).select("nickname level exp followingCount followerCount profileImage _id")
        user = await Follow.checkFollowing(user, myUserId, userId)
		const reviews = await Review.find({user: userId}).populate("book").sort('-created_at')
		const collections = await Collection.find({user: userId}).sort('-created_at')

		return res.json({user, reviews, collections})
	} catch (e) {
		console.error(e)
		return next(new Error('유저 피드 불러오기를 실패했습니다.'))
	}
})
// 나의 유저정보 불러오기
router.get('/', async (req, res, next) => {
	const { _id: userId } = res.locals.user

	try {
        const user = await User.findById(userId)

		return res.json({user})
	} catch (e) {
		console.error(e)
		return next(new Error('유저 정보 불러오기를 실패했습니다.'))
	}
})
// 나의 유저정보 수정
router.put('/', async (req, res, next) => {
	const { _id : userId } = res.locals.user
    const { nickname, profileImage } = req.body
    try{
        const user = await User.findById(userId)

        if (user === null) return next(new Error('DB에 등록되지 않은 userId입니다'))
    }catch(e){
        return next(new Error('유저 검색에 실패했습니다.'))
    }

    try{
        if(!nickname){
            const user = await User.findByIdAndUpdate(userId, { ...req.body },{new: true})
    
            return res.json({user})
        }
    }catch(e){
        return next(new Error('회원정보 수정을 실패했습니다.'))
    }

    try{
        if (await User.findOne({ nickname }))
        
        return next(new Error('해당 닉네임이 존재합니다.'))

        const user = await User.findByIdAndUpdate(userId, { nickname },{new: true})

        const token = jwt.sign(
            { userId: user._id, nickname: user.nickname },
            process.env.TOKEN_KEY
            )

            return res.json({token, user})

    }catch(e){
        return next(new Error('nickname 등록을 실패했습니다.'))
    }
})
// 나의 유저정보 삭제
router.delete('/', async (req, res, next) => {
	const { _id : userId } = res.locals.user
	try {
		const user = await User.findByIdAndDelete(userId)

        if (user == null) return next(new Error('등록되지 않은 유저입니다'))

		// todo: 추후에 미들웨어로 바꿀 예정
		await Review.deleteMany({ user: userId })
        await Follow.deleteMany({ $or: [ {sender: userId}, {receiver: userId} ]})
        
		const collections = await Collection.find({ user: userId })

        if(collections.length !== 0){
            collections.map( async (collection) => {
                await collection.delete()
            })
        }

		return res.sendStatus(200)
	} catch (e) {
		return next(new Error('삭제에 실패했습니다.'))
	}
})

// 프로필 이미지 획득
router.put("/profile/image", async (req, res, next) => {
    const { _id : userId } = res.locals.user
    const { imageName } = req.body
    const treasure = false
    try{
        let user = await User.findByIdAndUpdate( userId, {treasure}, {new : true} )
        let { own_image } = user

        if (own_image.includes(imageName)) return next(new Error('이미 프로필 이미지를 가지고 있습니다.'))

        own_image.push(imageName)

        user = await user.save()

        res.json(user)
    }catch{
        return next(new Error('프로필 이미지 획득을 실패헀습니다.'))
    }
    
})
// 보물 확인
router.get('/profile/treasure', async (req,res,next) => {
    const { _id : userId } = res.locals.user
    
    const {treasure} = await User.findById(userId)

    res.json({treasure})
})

router.get('/profile/bookmark', async (req, res, next) => {
    const { _id: userId} = res.locals.user
    
    const {bookmark_reviews} = await User.findById(userId).populate({path:'bookmark_reviews', populate: 'book'})

    res.json({bookmark_reviews})
})
export default router
