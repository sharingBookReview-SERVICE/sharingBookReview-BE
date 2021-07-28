import express from 'express'

const router = new express.Router()

const sampleUser = {	
    _id: '유저아이디',
    nickname: '마산독서남',
    provider: 'kakao',
    providerKey: '338473284723238932434324',
    userImage: 'https://www.pharmnews.com/news/photo/202009/101300_52229_3331.jpg'	
}

const token = "dsfa39919ufndfasdffn3o220192ydfnl20342fnf0dnav0sd0f"

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
	return res.sendStatus(sampleReview)
})

export default router