import express from 'express'
import { Book, Collection, User } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'
import searchBooks from '../controllers/searchbooks.js'
import saveBook from '../controllers/save_book.js'


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

    try{
        await User.getExpAndLevelUp(userId, "collection")
    }catch (e) {
        return next(new Error('경험치 등록을 실패했습니다.'))
    }

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
		const collections = await Collection.find(req.query).populate('contents.book', '-reviews').sort('-created_at')

		return res.json({ collections })
	} catch (e) {
		console.error(e)
		return next(new Error('콜렉션 불러오기를 실패했습니다.'))
	}
})

router.get('/:collectionId', async (req, res, next) => {
	const { collectionId } = req.params
	try {
		const collection = await Collection.findById(collectionId).populate('contents.book', '-reviews').populate('user', 'nickname level followingCount followerCount')

		return res.json({ collection })
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 내용 불러오기를 실패했습니다.'))
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

router.delete('/:collectionId', async (req, res, next) => {
	const { collectionId } = req.params
	const { _id: userId } = res.locals.user

	try {
		//todo put 과 묶어서 함수로 빼기
		const collection = await Collection.findById(collectionId)

		if (!collection)
			return next(new Error('존재하지 않는 컬렉션 아이디입니다.'))

		if (String(collection.user) !== String(userId))
			return next(new Error('로그인된 사용자가 컬렉션 작성자가 아닙니다.'))

		await collection.delete()

		return res.sendStatus(204)
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 삭제를 실패했습니다.'))
	}
})

export default router