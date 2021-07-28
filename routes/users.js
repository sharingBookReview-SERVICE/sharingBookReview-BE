import express from 'express'

const router = new express.Router({ mergeParams: true })


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