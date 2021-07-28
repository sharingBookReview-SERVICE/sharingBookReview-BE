import express from 'express'

const router = new express.Router({ mergeParams: true })

const sampleBooks = [
	{
		title: '지구인만큼 지구를 사랑할 순 없어',
		link: 'http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791191583793&orderClick=s1a',
		image: 'http://image.kyobobook.co.kr/images/book/large/793/l9791191583793.jpg',
		author: '정세랑',
		price: '16,800원',
		discount: '15,120원',
		publisher: '위즈덤하우스',
		bookId: 979119176611005810,
		description:
			'지구 구석구석 모두의 반짝이는 안녕을 바라며 빛과 사랑의 방향으로 한걸음 나아가는 여행',
		pubdate: '2021년 06월 10일',
	},
]

const sampleBestseller = [
	(book2 = {
		title: '달러구트 꿈 백화점',
		link: 'http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791165341909&orderClick=LAG&Kc=',
		image: 'http://image.kyobobook.co.kr/images/book/large/909/l9791165341909.jpg',
		author: '이미예',
		price: '13,800원',
		discount: '12,420원',
		publisher: '팩토리나인',
		bookId: 979116534315605810,
		description:
			'잠들어야만 입장 가능한 꿈 백화점에서 일어나는 비밀스럽고도 기묘하며 가슴 뭉클한 판타지 소설',
		pubdate: '2020년 07월 08일',
	}),
]

// 책 목록
router.get('/books', (req, res) => {
	return res.json(sampleBooks)
})

// 베스트 샐러
router.get('/bestseller', (req, res) => {
	return res.json(sampleBestseller)
})
// 개별 책 선택
router.get('/:bookId', (req, res) => {
	return res.json(sampleBooks.book1)
})
export default router
