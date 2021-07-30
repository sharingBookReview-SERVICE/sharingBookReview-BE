import express from 'express'
import Review from '../models/review.js'
import saveBooks from './controllers/savebooks.js'
import searchBooks from './controllers/searchbooks.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res) => {
    const { bookId } = req.params
    // const { userId } = req.locals.user   
    const { quote, content, hashtags, image } = req.body

    const searchList = searchBooks(isbn, bookId)
    saveBooks(searchList[0], bookId)
    const review = new Review({
        // userId,
        book: Number(bookId),
        quote,
        content,
        hashtags,
        image,
    })
    await review.save()

	return res.sendStatus(201)
})

router.get('/', async (req, res) => {
    const { bookId } = req.params

    const reviewList = await Review.find({ book : bookId })
    
	return res.json({reviewList})
})

router.get('/:reviewId', async (req, res) => {
    const { bookId } = req.params
    const { reviewId } = req.params

    const review = await Review.find({ _id: reviewId })
    
	return res.json({ review })
})

router.put('/:reviewId', async (req, res) => {
    const { bookId } = req.params
    const { reviewId } = req.params
    const { quote, content, hashtags, image } = req.body
    
    await Review.findOneAndUpdate(
        { _id: reviewId },
        { quote, content, hashtags, image }
        )

	return res.sendStatus(202)
})

router.delete('/:reviewId', async(req, res) => {
    const { bookId } = req.params
    const { reviewId } = req.params

    await Review.deleteOne({_id: reviewId})
    
	return res.sendStatus(202)
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router