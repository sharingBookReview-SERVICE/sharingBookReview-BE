import express from 'express'
import { Collection, User, Comment, Book } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'
import { validateId, saveBook } from '../controllers/utilities.js'
import { likeUnlike } from '../models/utilities.js'
import searchBooks from '../controllers/searchbooks.js'
import CollectionCtrl from './collection.controller.js'

const router = new express.Router()
const upload = multer({
	dest: 'uploads/',
})

// Login optional

/**
 * Get all collections
 */
router.get('/', authMiddleware(false), CollectionCtrl.apiGetCollections)

// Login compulsory

router.use(authMiddleware(true))

/**
 * Create a collection
 */
router.post('/', upload.single('image'), ImageUpload.uploadImage, CollectionCtrl.apiPostCollection)

router.route('/:collectionId')
	.get(CollectionCtrl.apiGetCollection)
	.put(CollectionCtrl.apiPutCollection)
	.delete(CollectionCtrl.apiDeleteCollection)


router.post('/:collectionId/comments', CollectionCtrl.apiPostComment)

router.route('/:collectionId/comments/:commentId')
	.patch(CollectionCtrl.apiPatchComment)
	.delete(CollectionCtrl.apiDeleteComment)

router.put('/:collectionId/likes', await likeUnlike(Collection, 'collection'))

export default router