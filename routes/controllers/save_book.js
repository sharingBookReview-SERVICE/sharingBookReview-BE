import { Book } from '../../models/index.js'
import getDescription from './book_detail_crawling.js'

// else if(key == "description"){
//     const description = await getDescription(array[i].link[0])
//     book[key] = description
// }

/**
 * Saves book search result into DB.
 * @param {Object} searchResult Search result from naver dev api.
 * @returns {Promise<Document<any, any, unknown>>} book document
 */
const saveBook = async (searchResult) => {
	const newBook = new Book()
	/**
	 * Fix search result's format into DB's format
	 */
	for (const [key, value] of Object.entries(searchResult)) {
        if (key == 'description'){
            const description = await getDescription(searchResult.link)
            newBook[key] = description
        }else{
            newBook[key] = value
        }
		
	}
	return await newBook.save()
}

export default saveBook
