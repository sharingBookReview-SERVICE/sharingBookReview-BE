import express from 'express'
import searchBooks from './controllers/searchbooks.js'
import getBestsellers from './controllers/bestseller_crawling.js'
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
	} catch (err) {
		console.error(err)
		return next(err)
	}
})

// 베스트 샐러
router.get('/bestsellers', async(req, res, next) => {
    try{
        const bestsellers = await getBestsellers()
	return res.json({bestsellers})
    } catch(err){
        console.error(err)
        return next(err)
    }

})

// 개별 책 선택
router.get('/:bookId', async (req, res, next) => {
    const { bookId } = req.params
    
	try {
		const searchList = await searchBooks(
			"isbn",
			bookId
		)
		return res.json(searchList[0])
	} catch (err) {
		console.error(err)
		return next(err)
	}
})

export default router
