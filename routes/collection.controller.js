import { Book, Collection, Comment, User } from '../models/index.js'
import searchBooks from '../controllers/searchbooks.js'
import { saveBook } from '../controllers/utilities.js'
import mongoose from 'mongoose'

const { isValidObjectId } = mongoose

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

		if (!isValidObjectId(collectionId)) return next({ message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 })

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

	static async apiPutCollection(req, res, next) {
		const { _id: userId } = res.locals.user
		const { collectionId } = req.params
		const { contents } = req.body

		if (!isValidObjectId(collectionId)) return next({ message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 })

		try {
			const collection = await Collection.findByIdAndUpdate(collectionId, req.body, {
				runValidators: true,
				new: true,
			})

			if (!collection) return next({ message: '존재하지 않는 컬렉션 아이디입니다.', status: 400 })
			if (String(collection.user) !== String(userId)) return next({
				message: '현 사용자와 컬렉션 작성자가 일치하지 않습니다.',
				status: 403,
			})

			contents.map(async (content) => {
				if (!await Book.findById(content.book)) {
					const [searchResult] = await searchBooks('isbn', content.book)
					await saveBook(searchResult)
				}
			})

			return res.status(201).json({ collection })
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션 수정을 실패했습니다.', status: 500 })
		}
	}

	static async apiDeleteCollection(req, res, next) {
		const { _id: userId } = res.locals.user
		const { collectionId } = req.params

		if (!isValidObjectId(collectionId)) return next({ message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 })

		try {
			const collection = await Collection.findById(collectionId)

			if (!collection) return next({ message: '존재하지 않는 컬렉션 아이디입니다.', status: 400 })
			if (String(collection.user) !== String(userId)) return next({
				message: '현 사용자와 컬렉션 작성자가 일치하지 않습니다.',
				status: 403,
			})

			await collection.delete()

			return res.sendStatus(204)
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션 삭제를 실패했습니다.', status: 500 })
		}
	}

	static async apiPostComment(req, res, next) {
		const { _id: userId } = res.locals.user
		const { collectionId } = req.params
		const { content } = req.body

		if (!isValidObjectId(collectionId)) return next({ message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 })
		if (!content.length) return next({ message: '댓글 내용이 존재하지 않습니다.', status: 400 })

		try {
			const collection = await Collection.findById(collectionId)
			const comment = new Comment({ content, user: userId })

			collection.comments.push(comment)
			await collection.save()

			await User.getExpAndLevelUp(userId, 'comment')

			return res.status(201).json({ collection })
		} catch (err) {
			console.error(err)
			return next({ message: '컬렉션 댓글 작성을 실패했습니다.', status: 500 })
		}
	}
}