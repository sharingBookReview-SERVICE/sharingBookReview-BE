import express from 'express'
import { Collection, User, Comment, Book } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'
import multer from 'multer'
import ImageUpload from '../controllers/image_upload.js'
import { validateId } from '../controllers/utilities.js'
import { likeUnlike } from '../models/utilities.js'
import saveBook from '../controllers/save_book.js'
import searchBooks from '../controllers/searchbooks.js'

const router = new express.Router()
const upload = multer({
	dest: 'uploads/',
})

// Login optional

/**
 * Get all collections
 */
router.get('/', authMiddleware(false), async (req, res, next) => {
	try {
		// query = { name, type }
		const collections = await Collection.find(req.query).populate('contents.book', '-reviews').sort('-created_at')

		return res.json({ collections })
	} catch (e) {
		console.error(e)
		return next(new Error('콜렉션 불러오기를 실패했습니다.'))
	}
})

// Login compulsory

router.use(authMiddleware(true))

/**
 * Create a collection
 */
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

    try{
        contents.map(async (content) => {
            if(!await Book.findById(content.book)){
                const [searchResult] = await searchBooks('isbn', content.book)
                await saveBook(searchResult)
            }
        })
    }catch(e){
        return next(new Error('책 정보 저장을 실패했습니다.'))
    }

	try {
		const collection = await Collection.create({ image, name, description, contents, type: 'custom', user: userId })

		return res.status(201).json({collection})
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 작성을 실패했습니다.'))
	}
})

/**
 * Get a collection by collection ID
 */
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

/**
 * Update a collection with req.body by ID
 */
router.put('/:collectionId', async (req, res, next) => {
	const { collectionId } = req.params
	const { _id: userId } = res.locals.user
    const { contents } = req.body

	try {
		const collection = await Collection.findByIdAndUpdate(collectionId, req.body, {runValidator: true, new: true})

		if (!collection)
			return next(new Error('존재하지 않는 컬렉션 아이디입니다.'))
        
		if (String(collection.user) !== String(userId))
			return next(new Error('로그인된 사용자가 컬렉션 작성자가 아닙니다.'))
        
        contents.map(async (content) => {
			if (!(await Book.findById(content.book))) {
				const [searchResult] = await searchBooks('isbn', content.book)
				await saveBook(searchResult)
			}
		})

		return res.status(201).json({ collection })
	} catch (e) {
		console.error(e)
		return next(new Error('컬렉션 수정을 실패했습니다.'))
	}
})

/**
 * Delete a collection by ID
 */
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

/**
 * todo 컬렉션 댓글 기능
 * 미완성
 */
router.post('/:collectionId/comments', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { collectionId } = req.params
	const { content } = req.body

	try {
		const collection = await validateId(Collection, collectionId)

		const comment = new Comment({ content, user: userId })

		collection.comments.push(comment)
		await collection.save()

		// todo 경험치 계산 추가하고 canGetExp 자체를 static method 로 분리시키기

		return res.status(201).json({ comment })
	} catch (e) {
		console.error(e)
		return next(new Error('댓글 작성을 실패했습니다.'))
	}
})

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