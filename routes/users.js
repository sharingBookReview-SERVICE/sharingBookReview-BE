import express from 'express'
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";

const router = new express.Router()

const sampleUser = {	
    _id: '유저아이디',
    nickname: '마산독서남',
    provider: 'kakao',
    providerKey: '338473284723238932434324',
    userImage: 'https://www.pharmnews.com/news/photo/202009/101300_52229_3331.jpg'	
}

const token = "dsfa39919ufndfasdffn3o220192ydfnl20342fnf0dnav0sd0f"

const sampleComment = {
	user: {
		_id: '유저아이디',
		nickname: '마산독서남',
	},
	book: {
		isbn: 9791158392239,
	},
	review: {
		reviewId: '리뷰아이디',
	},
	content: '리뷰가 유익하네요.',
	created_at: '20210728',
}

const sampleReview = {
	user: {
		_id: '유저아이디',
		nickname: '마산독서남',
	},
	book: {
		isbn: 9791158392239,
		title: '모던 자바스크립트 Deep Dive',
		link: 'http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158392239&orderClick=LAG&Kc=',
		image: 'http://image.kyobobook.co.kr/images/book/large/239/l9791158392239.jpg',
		author: '이웅모',
		price: 45000,
		discount: 0.1,
		description:
			'269개의 그림과 원리를 파헤치는 설명으로 ‘자바스크립트의 기본 개념과 동작 원리’를 이해하자!\\n웹페이지의 단순한 보조 기능을 처리하기 위한 제한적인 용도로 태어난 자바스크립트는 과도하다고 느껴질 만큼 친절한 프로그래밍 언어입니다. 이러한 자바스크립트의 특징은 편리한 경우도 있지만 내부 동작을 이해하기 어렵게 만들기도 합니다.',
		pubdate: '2020925',
	},
	quote: '자바스크립트 최고',
	content: '이책 정말 좋아요',
	hashtag: ['개발', '자바스크립트', '자세한'],
	createdAt: '20210726',
	comments: [sampleComment],
	myLike: true,
	likes: 10,
}
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


router.post('/:provider', (req, res) => {
	return res.json({
        nickname : sampleUser.nickname, userImage: sampleUser.userImage, token
    })
})

router.get('/:userId', (req, res) => {
	return res.json(sampleUser)
})

router.put('/:userId', (req, res) => {
	return res.sendStatus(200)
})

router.delete('/:userId', (req, res) => {
	return res.sendStatus(200)
})

router.get('/:userId/reviews', (req, res) => {
	return res.json(sampleReview)
})

export default router