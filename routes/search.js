import express from 'express'
import authMiddleware from '../middleware/auth_middleware.js'
import Collection from '../models/collection.js'

const router = new express.Router()

router.get('/', authMiddleware(false), async (req, res, next) => {
    try{
        let result = await Collection.aggregate([
            {
            '$search': {
                'index': 'auto_tag', 
                'autocomplete': {
                    'path': 'name',
                    'query': `${req.query.tag}`,
                    "fuzzy": {
                        "maxEdits": 2,
                        "prefixLength": 3
                    }
                }
            }
            }
            
        ]
        )

        return res.status(200).json({result})

    }catch(e){
        console.error(e)
		return next(new Error('태그 검색을 실패했습니다.'))
    }
    
})

router.get('/allTags', authMiddleware(false), async (req, res, next) => {
    try{
        
        const collections = await Collection.find({type: 'tag'})

        const allTags = collections.map((collection) => { collection.name })

        return res.status(200).json({allTags})

    }catch(e){
        console.error(e)
		return next(new Error('태그 배열을 불러오는데 실패했습니다.'))
    }
    
})
export default router