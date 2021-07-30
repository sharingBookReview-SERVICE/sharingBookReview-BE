import axios from 'axios'
import { parseString } from 'xml2js'
import Book from '../../models/book.js'

const checkBookDatabase = async (array) => {
    for (let i = 0; i < array.length; i++){
        const isbn = array[i].isbn[0].split(' ')[1]
        const existBook = await Book.findById(isbn)
        if (existBook == null){
            let book = new Book;
            for (let [key,value] of Object.entries(array[i])){
                if(key == 'isbn'){
                    book[key] = value[0].split(' ')[1]
                }else{
                    book[key] = value[0]     
                }                           
            }
            console.log(book)
            await book.save()
        }
    }
    return
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
		title: 'd_titl',
		author: 'd_auth',
        isbn: 'd_isbn'
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
    checkBookDatabase(searchList)
	return searchList
}

export default searchBooks
