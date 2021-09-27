import axios from 'axios'
import { parseStringPromise } from 'xml2js'

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
		return crawlController.reformatSearchResult(searchResult)
	}
}

const removeArrayInValue = async (array) => {
	const bookList =[]
	for (let i = 0; i < array.length; i++){
		const book = {}
		for (const [key,value] of Object.entries(array[i])){
			if(key == 'isbn'){
				book[key] = value[0].split(' ')[1]
			}else{
				book[key] = value[0]
			}
		}
		bookList.push(book)
	}
	return bookList
}

/**
 * Search book information on naver.
 * @param {string} target - Search target must be either d_titl, d_auth, or d_isbn
 * @param {string} query - Search query
 * @returns {Promise<Object[]>}
 */
const searchBooks = async (target, query) => {
	const client_id = process.env.BOOK_API_CLIENT_ID
	const client_secret = process.env.BOOK_API_CLIENT_SECRET
	const targetConverter = {
		제목: 'd_titl',
		저자: 'd_auth',
		출판사: 'd_publ',
		isbn: 'd_isbn',
	}
	const api_url =
		`https://openapi.naver.com/v1/search/book_adv.xml?${targetConverter[target]}=` +
		encodeURI(query)
	const result = await axios({
		method: 'get',
		url: api_url,

		headers: {
			'X-Naver-Client-Id': client_id,
			'X-Naver-Client-Secret': client_secret,
		},
	}) // todo 프로미스로 이어 보자
	let searchList
	parseString(result.data, (err, result, next) => {
		if (err) {
			console.error(err)
			return next(err)
		}
		searchList = result.rss.channel[0].item
	})
	return removeArrayInValue(searchList)
}
