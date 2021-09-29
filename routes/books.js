import { Router } from 'express'
import BookController from '../controllers/book.controller.js'

const router = new Router({ mergeParams: true })

router.get('/', BookController.apiGetBooks)
router.get('/:bookId', BookController.apiGetBook)
router.get('/bestsellers', BookController.apiGetBestsellers)

export default router
