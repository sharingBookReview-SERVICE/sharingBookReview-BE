import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import Collection from '../models/collection.js'

const router = new express.Router()

router.get('/', authMiddleware(false), async (req, res, next) => {
    try{
        let result = await Collection.aggregate([
            {
            '$search': {
                'index': 'tag', 
                'text': {
                    'query': `${req.query.tag}`, 
                    'path': 'name'
                }, 
                'highlight': {
                    'path': 'name'
                }
            }
            }
        ]
        )

        return res.status(201).json({result})

    }catch(e){
        console.error(e)
		return next(new Error('태그 검색을 실패했습니다.'))
    }
    
})

export default router