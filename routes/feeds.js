import express from 'express'

const router = new express.Router()

router.get('/', (req, res) => {
	return res.send('여기에 피드가 갈겁니다.')
})

export default router