import express from 'express'
import Review from '../models/review.js'
import saveBooks from './controllers/savebooks.js'

const router = new express.Router({ mergeParams: true })

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
		nickname: '마산독서남'
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
		pubdate: '2020925'
	},
	quote: '자바스크립트 최고',
	content: '이책 정말 좋아요',
	hashtag: ['개발', '자바스크립트', '자세한'],
	createdAt: '20210726',
	comments: [sampleComment],
	myLike: true,
	likes: 10
}

router.post('/', async (req, res) => {
    const { bookId } = req.params
    // const { userId } = req.locals.user   
    const { book, quote, content, hashtags, image } = req.body

    saveBooks(bookId)
    const review = new Review({
        // userId,
        bookId,
        quote,
        content,
        hashtags,
        image,
    })
    await review.save()

    
	return res.sendStatus(201)
})

router.get('/', (req, res) => {
	return res.json([sampleReview, sampleReview])
})

router.get('/:reviewId', (req, res) => {
	return res.json(sampleReview)
})

router.put('/:reviewId', (req, res) => {
	return res.sendStatus(201)
})

router.delete('/:reviewId', (req, res) => {
	return res.sendStatus(200)
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router