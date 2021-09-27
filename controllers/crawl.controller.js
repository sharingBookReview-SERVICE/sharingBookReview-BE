import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import cheerio from 'cheerio'

export default class crawlController {
	static async searchBooks (target, query) {
		const CLIENT_ID = process.env.BOOK_API_CLIENT_ID
		const CLIENT_SECRET = process.env.BOOK_API_CLIENT_SECRET
		// noinspection NonAsciiCharacters,SpellCheckingInspection
		const TARGETS = {
			'제목': 'd_titl',
			'저자': 'd_auth',
			'출판사': 'd_publ',
			'isbn': 'd_isbn',
		}
		const URL = `https://openapi.naver.com/v1/search/book_adv.xml?${TARGETS[target]}=${encodeURI(query)}`

		const { data } = await axios.get(URL, {
			headers: {
				'X-Naver-Client-Id': CLIENT_ID,
				'X-Naver-Client-Secret': CLIENT_SECRET,
			}
		})

		const parsedString = await parseStringPromise(data)
		const searchResult = parsedString.rss.channel[0].item
		return crawlController.#reformatSearchResult(searchResult)
	}

	static #reformatSearchResult(searchResult) {
		return searchResult.map(book => {
			const object = {}
			for (const [key, value] of Object.entries(book)) {
				if (key === 'isbn') object[key] = value[0].split(' ')[1]
				else object[key] = value[0]
			}
			return object
		})
	}

	static async getDetailedBookDescription(link) {
		const { data } = await axios.get(link)
		const $ = cheerio.load(data)
		return $('#bookIntroContent').text()
	}
}