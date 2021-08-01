import express from 'express'
import User from "../models/user.js";
import Review from "../models/review.js";
import passport from "passport";

const router = new express.Router()

// kakao-login
router.get("/kakao", passport.authenticate("kakao"));

router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		failureRedirect: '/kakao',
	}), (req, res) => {
        return res.redirect('/')
    }
)

router.put("/nickname/:userId", async (req,res) => {
	// if user do not have nickname use this router
	const { userId } = req.params
	const { nickname } = req.body

	await User.findByIdAndUpdate(userId, { nickname })

	return res.sendStatus(200)
})

router.get('/:userId', async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

	return res.json({user})
})

router.put('/:userId', async (req, res) => {
    const { userId } = req.params
    const { nickname } = req.body

    await User.findByIdAndUpdate(userId, { nickname })

	return res.sendStatus(200)
})

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params
    
    await User.findByIdAndDelete(userId)

	return res.sendStatus(200)
})

router.get('/:userId/reviews', async (req, res) => {
    const { userId } = req.params
    // id에 관한건 confirm merge 후에 findOne안의 인자와 select,populate값 user:userId로 바꿔줘야함
    // 각 기능 userId 추가 후에 기능 검사 필
    const reviews = await Review.findOne({ userId }).select('reviews').populate({
        path: 'reviews',
        options: { sort: { created_at: -1 } },
    })

	return res.json(reviews)
})

export default router