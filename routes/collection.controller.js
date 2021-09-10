import { Collection, User } from '../models/index.js'
import searchBooks from '../controllers/searchbooks.js'
import { saveBook } from '../controllers/utilities.js'

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

	static async apiPostCollection(req, res, next) {

		const { _id: userId } = res.locals.user
		const { name, description } = req.body
		const contents = JSON.parse(req.body.contents)
		const image = res.locals?.url

		// Find books not saved in db and save them
		try {
			contents.map(async (content) => {
				if (!await Book.findById(content.book)) {
					const [searchResult] = await searchBooks('isbn', content.book)
					await saveBook(searchResult)
				}
			})
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션에 담긴 새로운 책 등록을 실패했습니다.', status: 500 })
		}

		try {
			const collection = await Collection.create({
				image,
				name,
				description,
				contents,
				type: 'custom',
				user: userId,
			})

			await User.getExpAndLevelUp(userId, 'collection')

			return res.status(201).json({ collection })
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션 작성을 실패했습니다.', status: 500 })
		}
	}

	static async apiGetCollection(req, res, next) {
		const { collectionId } = req.params

		try {
			const collection = await Collection.findById(collectionId)
				.populate({
					path: 'contents.book',
					select: '-reviews',
				})
				.populate({
					path: 'user',
					select: 'nickname level followingCount followerCount',
				})

			return res.json({ collection })
		} catch (err) {
			console.error(err)
			return next({ message: '개별 컬렉션 불러기를 실패했습니다.', status: 500 })
		}
	}
}