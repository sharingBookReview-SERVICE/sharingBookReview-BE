import express from 'express'

const router = new express.Router({ mergeParams: true })

const sampleUser = {	
    _id: '유저아이디',
    nickname: '마산독서남',
    provider: 'kakao',
    providerKey: '338473284723238932434324',
    userImage: 'https://www.pharmnews.com/news/photo/202009/101300_52229_3331.jpg'	
}

const token = "dsfa39919ufndfasdffn3o220192ydfnl20342fnf0dnav0sd0f"

router.post('/users/:provider', (req, res) => {
	return res.json()
})

router.get('/users/:userId', (req, res) => {
	return res.json(sampleReview)
})

router.put('/users/:userId', (req, res) => {
	return res.sendStatus(200)
})

router.delete('/users/:userId', (req, res) => {
	return res.sendStatus(200)
})

router.get('/users/:userId/reviews', (req, res) => {
	return res.sendStatus(200)
})

export default router