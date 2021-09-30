import express from 'express'
import { Collection } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import { likeUnlike } from '../models/utilities.js'
import CollectionCtrl from '../controllers/collection.controller.js'
import ImageUploadController from '../controllers/image_upload.controller.js'

const router = new express.Router()
const upload = multer({
	dest: 'uploads/',
})

// Login optional

router.get('/', authMiddleware(false), CollectionCtrl.apiGetCollections)

// Login compulsory

router.use(authMiddleware(true))

router.post('/', upload.single('image'), ImageUploadController.uploadImage, CollectionCtrl.apiPostCollection)

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