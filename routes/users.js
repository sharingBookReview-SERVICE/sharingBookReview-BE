import express from 'express'
import { User, Review } from '../models/index.js'
import passport from "passport"
import jwt from 'jsonwebtoken'

const router = new express.Router()

// kakao-login
router.get("/kakao", passport.authenticate("kakao"));

router.get(
	'/kakao/callback', (req, res, next) =>{
	passport.authenticate(
		'kakao',
		{
			failureRedirect: '/kakao',
		},
		(err, profile, token) => {
			if (err) return next(new Error('소셜로그인 에러'))
			return res.redirect(`http://localhost:3000/logincheck/token=${token}`)
		}
	)(req, res, next)
    })

router.put("/nickname/:userId", async (req,res,next) => {
	// if user do not have nickname use this router
    const { userId } = req.params
	const { nickname } = req.body
    
    try{		
        if (await User.findOne({nickname})) return next(new Error('해당 닉네임이 존재합니다.'))

		const user = await User.findByIdAndUpdate(userId,{nickname})

        if (user == null)return next(new Error('등록되지 않은 유저입니다'))

        const token = jwt.sign({ userId: user._id, nickname : user.nickname }, 'ohbinisthebest')

		return res.json(token)

	} catch(e) {
        return next(new Error('nickname 등록을 실패했습니다.'))
    }
	
})

router.get('/:userId', async (req, res, next) => {
    const { userId } = req.params
    try{
        const user = await User.findById(userId)
        
        return res.json({user})

    } catch(e) {
        return next(new Error('user를 찾는데 실패했습니다.'))
    }

    
})

router.put('/:userId', async (req, res, next) => {
    const { userId } = req.params
    const { nickname } = req.body
    try{
        const user = await User.findByIdAndUpdate(userId,{nickname})
		
        if (user == null)return next(new Error('등록되지 않은 유저입니다'))
		
        return res.sendStatus(200)

    } catch(e) {
        return next(new Error('수정에 실패했습니다.'))
    }

    
})

router.delete('/:userId', async (req, res, next) => {
    const { userId } = req.params
    try{
        const user = await User.findByIdAndDelete(userId)
        
        if (user == null)return next(new Error('등록되지 않은 유저입니다'))
        // todo: 추후에 미들웨어로 바꿀 예정
        await Review.findOneAndRemove({user: userId})

        return res.sendStatus(200)

    } catch(e) {
        return next(new Error('삭제에 실패했습니다.'))
    }
    
    
})

router.get('/:userId/reviews', async (req, res, next) => {
	const { userId } = req.params
	// id에 관한건 confirm merge 후에 findOne안의 인자와 select,populate값 user:userId로 바꿔줘야함
	// 각 기능 userId 추가 후에 기능 검사 필
	try {
		const reviews = await Review.findOne({ userId })
			.select('reviews')
			.populate({
				path: 'reviews',
				options: { sort: { created_at: -1 } },
			})

		return res.json(reviews)
	} catch (e) {
		return next(new Error('nickname 등록을 실패했습니다.'))
	}
})

export default router