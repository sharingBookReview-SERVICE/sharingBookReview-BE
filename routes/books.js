import express from 'express'
import { Book } from '../models/index.js'
import searchBooks from './controllers/searchbooks.js'
import getBestsellers from './controllers/bestseller_crawling.js'
import authMiddleware from '../middleware/auth_middleware.js'
import dotenv from 'dotenv'
dotenv.config()

const router = new express.Router({ mergeParams: true })

// 책 목록
router.get('/', async (req, res, next) => {
	const { target, query } = req.query
	
	//todo 나중에 맵으로 고치기	
	try {
		const searchList = await searchBooks(
			target,
			query
		)
		return res.json({ searchList })
	} catch (e) {
		return next(new Error('책 목록을 불러오는데 실패했습니다.'))
	}
})

// 베스트 샐러
router.get('/bestsellers', async(req, res, next) => {
    try{
        const bestsellers = await getBestsellers()
	return res.json({bestsellers})
    } catch(e){
        return next(new Error('베스트셀러 목록을 불러오는데 실패했습니다.'))
    }

})

// 개별 책 선택
router.get('/:bookId', async (req, res, next) => {
    const { bookId } = req.params
	try {
		const book = await Book.findById(Number(bookId))
		if (book) {
			return res.json({book})
		}
	} catch (e) {
    	console.error(e)
		return next(new Error('DB 에서 책 검색을 실패했습니다.'))
	}

	try {
		const searchList = await searchBooks(
			"isbn",
			bookId
		)
		return res.json(searchList[0])
	} catch (e) {
		return next(new Error('책 정보를 불러오는데 실패했습니다.'))
	}
})

export default router
