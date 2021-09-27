import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import cheerio from 'cheerio'

export default class crawlController {
	/**
	 * Search books with target and query in naver dev api
	 * @param target {제목|저자|출판사|isbn}
	 * @param query {string|number}
	 * @returns {Promise<Object[]>}
	 */
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

	/**
	 * Change original search result of a nested array to an array of objects
	 * @param searchResult
	 * @returns {Object[]}
	 */
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

	/**
	 * Get detailed book description from link
	 * @param link {string} Naver detailed book description
	 * @returns {Promise<string>} Description text
	 */
	static async getDetailedBookDescription(link) {
		const { data } = await axios.get(link)
		const $ = cheerio.load(data)
		return $('#bookIntroContent').text()
	}
}