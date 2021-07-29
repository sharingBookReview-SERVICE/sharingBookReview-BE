import axios from 'axios'
import { parseString } from 'xml2js'

/**
 * Search book information on naver.
 * @param {string} target - Search target must be either d_titl or d_auth
 * @param {string} query - Search query
 * @param {string} client_id - Naver dev api account id
 * @param {string} client_secret - Naver dev api account secret key
 * @returns {Promise<Object[]>}
 */
const searchBooks = async (target, query, client_id, client_secret) => {
	const api_url =
		`https://openapi.naver.com/v1/search/book_adv.xml?${target}=` +
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
	return searchList
}

export default searchBooks
