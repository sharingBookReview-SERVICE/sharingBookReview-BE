import { Book } from '../models/index.js'
import crawlController from './crawl.controller.js'
import SuperController from './super.controller.js'

export default class BookController extends SuperController {
	static async apiGetBooks(req, res, next) {
		const TARGETS = ['제목', '저자', '출판사', 'isbn', 'tag']

		const { target, query } = req.query

		if (!TARGETS.includes(target)) {
			return next({ message: `${target} 은(는) 유효하지 않은 target 입니다.`, status: 400 })
		}

		if (target === 'tag') {
			try {
				const books = await Book.find({ topTags: query })

				return res.json({ searchList: books })
			} catch (err) {
				console.error(err)
				return next({ message: '태그를 이용한 전체 책 불러오기를 실패했습니다.', status: 500 })
			}
		}

		try {
			const searchList = await crawlController.searchBooks(target, query)
			return res.json({ searchList })
		} catch (err) {
			return next({ message: '전체 책 불러오기를 실패했습니다.', status: 500 })
		}
	}

	static async apiGetBook(req, res, next) {
		try {
			const { bookId } = BookController._getIds(req)
			const book = await Book.findById(bookId) ?? (await crawlController.searchBooks('isbn', bookId))[0]

			// todo res.json({ book }) 으로 바꾸고 프론트엔드에 적용하기
			return res.json(book)
		} catch (err) {
			console.error(err)
			return next({ message: 'DB 에서 책 검색을 실패했습니다.', status: 500 })
		}
	}

	static async apiGetBestsellers(req, res) {
		return res.sendStatus(501)
	}
}