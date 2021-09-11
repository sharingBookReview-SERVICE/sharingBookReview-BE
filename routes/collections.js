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


router.patch('/:collectionId/comments/:commentId', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { collectionId, commentId } = req.params
	const { content } = req.body

	try {
		const collection = await validateId(Collection, collectionId)

		const comment = new Comment({ content, user: usrId })

		collection.comments.id(commentId).content = content
		await collection.save()

		return res.json({ comment })
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 수정을 실패했습니다.'))
	}
})

router.delete('/:collectionId/comments/:commentId', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { collectionId, commentId } = req.params

	try {
		const collection = await validateId(Collection, collectionId)

		await collection.comments.pull(commentId)
		await collection.save()

		return res.sendStatus(204)
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 삭제를 실패했습니다.'))
	}
})

router.put('/:collectionId/likes', await likeUnlike(Collection, 'collection'))

export default router