import express from 'express'

const router = new express.Router({ mergeParams: true })

router.post('/', (req, res) => {
	return res.sendStatus(201)
})

router.patch('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

router.delete('/:commentId', (req, res) => {
	return res.sendStatus(200)
})

export default router
