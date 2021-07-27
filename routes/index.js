import express from 'express'
// import usersRouter from './usersRouter.js'
// import booksRouter from './booksRouter.js'
import reviewsRouter from './reviews.js'
// import commentsRouter from './commentsRouter.js'

const router = express.Router()

// router.use('/api/users', usersRouter)
// router.use('/api/commentsRouter', commentsRouter) // temp path
router.use('/api/reviewsRouter', reviewsRouter) // temp path
// router.use('/api/booksRouter', booksRouter)

// Swagger

export default router