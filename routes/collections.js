import express from 'express'
import { Collection } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'


const router = new express.Router()
const upload = multer({
	dest: 'uploads/',
})

router.use(authMiddleware)

router.post('/', upload.single('image'), ImageUpload.uploadImage, async (req, res, next) => {
	const { _id: userId } = res.locals.user
    const image = res.locals?.url
    const { name, description } = req.body
    const contents = JSON.parse(req.body.contents)
	try {
		const collection = await Collection.create({ image, name, description, contents, type: 'custom', user: userId })

		return res.status(201).json({collection})
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 작성을 실패했습니다.'))
	}
})

// Get all collections
router.get('/', async (req, res, next) => {
	try {
		// query = { name, type }
		const collections = await Collection.find(req.query).populate('contents.book', '-reviews')

		return res.json({ collections })
	} catch (e) {
		console.error(e)
		return next(new Error('콜렉션 불러오기를 실패했습니다.'))
	}
})

router.put('/:collectionId', async (req, res, next) => {
	const { collectionId } = req.params
	const { _id: userId } = res.locals.user
	try {
		const collection = await Collection.findById(collectionId)

		if (!collection)
			return next(new Error('존재하지 않는 컬렉션 아이디입니다.'))
        
		if (String(collection.user) !== String(userId))
			return next(new Error('로그인된 사용자가 컬렉션 작성자가 아닙니다.'))

		await collection.update(req.body)

		return res.status(201).json({ collection })
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 수정을 실패했습니다.'))
	}
})

export default router