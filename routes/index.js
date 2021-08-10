import express from 'express'
import usersRouter from './users.js'
import reviewsRouter from './reviews.js'
import commentsRouter from './comments.js'
import booksRouter from './books.js'
import feedsRouter from './feeds.js'
import collectionsRouter from './collections.js'

const router = express.Router()
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.use('/api/users', usersRouter)
router.use('/api/books/:bookId/reviews/:reviewId/comments', commentsRouter) // temp path
router.use('/api/books/:bookId/reviews', reviewsRouter) // temp path
router.use('/api/books', booksRouter)
router.use('/api/feeds', feedsRouter)
router.use('/api/collections', collectionsRouter)

export default router
