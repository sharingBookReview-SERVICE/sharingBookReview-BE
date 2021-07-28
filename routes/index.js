import express from 'express'
import usersRouter from './users.js'
// import booksRouter from './booksRouter.js'
import reviewsRouter from './reviews.js'
import commentsRouter from './comments.js'

const router = express.Router()

router.use('/api/users', usersRouter)
router.use('/api/books/:bookId/reviews/:reviewId/comments', commentsRouter) // temp path
router.use('/api/books/:bookId/reviews', reviewsRouter) // temp path
// router.use('/api/booksRouter', booksRouter)

// Swagger

export default router
