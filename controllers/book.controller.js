import { Book } from '../models/index.js'
import crawlController from './crawl.controller.js'

export default class BookController {
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
}