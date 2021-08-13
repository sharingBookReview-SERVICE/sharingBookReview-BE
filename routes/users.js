import express from 'express'
import { User, Review } from '../models/index.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = new express.Router()

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
			return res.redirect(
				// `http://diver.shop.s3-website.ap-northeast-2.amazonaws.com/logincheck/token=${token}`
				`http://localhost:3000/logincheck/token=${token}`
			)
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
			return res.redirect(
				// `http://diver.shop.s3-website.ap-northeast-2.amazonaws.com/logincheck/token=${token}`
				`http://localhost:3000/logincheck/token=${token}`
			)
		}
	)(req, res, next)
})

//log-out
router.get('/logout', (req, res, next) => {
	try { 
		req.logout()
		// res.redirect('http://diver.shop.s3-website.ap-northeast-2.amazonaws.com')
		res.redirect('http://localhost:3000')
	} catch (e) {
		return next(new Error('로그아웃에 실패했습니다.'))
	}
})

router.put('/nickname/:userId', async (req, res, next) => {
	// if user do not have nickname use this router
	const { userId } = req.params
	const { nickname } = req.body

	try {
		if (await User.findOne({ nickname }))
			return next(new Error('해당 닉네임이 존재합니다.'))

		const user = await User.findByIdAndUpdate(userId, { nickname })

        if (user == null) return next(new Error('DB에 등록되지 않은 userId입니다'))

		const token = jwt.sign(
			{ userId: user._id, nickname: user.nickname },
			process.env.TOKEN_KEY
		)

		return res.json(token)
	} catch (e) {
		return next(new Error('nickname 등록을 실패했습니다.'))
	}
})

router.get('/:userId', async (req, res, next) => {
	const { userId } = req.params
	try {
		const user = await User.findById(userId)

		return res.json( user )
	} catch (e) {
		return next(new Error('user를 찾는데 실패했습니다.'))
	}
})

router.put('/:userId', async (req, res, next) => {
	const { userId } = req.params
	try {
		const user = await User.findByIdAndUpdate(userId, { ...req.body },{new: true})
		if (user == null) return next(new Error('등록되지 않은 유저입니다'))

		return res.json(user)
	} catch (e) {
		return next(new Error('수정에 실패했습니다.'))
	}
})

router.delete('/:userId', async (req, res, next) => {
	const { userId } = req.params
	try {
		const user = await User.findByIdAndDelete(userId)

		// todo: 추후에 미들웨어로 바꿀 예정
		await Review.findOneAndRemove({ user: userId })

		if (user == null) return next(new Error('등록되지 않은 유저입니다'))

		return res.sendStatus(200)
	} catch (e) {
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
// 프로필 이미지 획득
router.put("/profile/:userId", async (req, res, next) => {
    const { userId } = req.params
    const { ImageName } = req.body
    const treasure = false
    try{
        let user = await User.findByIdAndUpdate( userId, {treasure}, {new : true} )
        let { own_image } = user
        own_image.push(ImageName)

        user = await user.save()

        res.json(user)
    }catch{
        return next(new Error('프로필 이미지 획득을 실패헀습니다.'))
    }
    
})


export default router
