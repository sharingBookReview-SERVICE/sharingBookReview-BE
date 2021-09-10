import { Collection } from '../models/index.js'

export default class CollectionController {
	static async apiGetCollections(req, res, next) {
		try {
			const collections = await Collection
				.find(req.query)
				.populate({
					path: 'contents.book',
					select: '-reviews',
				})
				.sort('-created_at')

			return res.json({ collections })
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션 불러오기를 실패했습니다.', status: 500 })
		}
	}
}