import { Book } from '../models/index.js'
import { getBookDescription } from './crawl.js'

/**
 * Check if the document with given id exists in the Collection of the Model
 * @param Model {mongoose.Model}
 * @param id {mongoose.Schema.Types.ObjectId}
 * @returns {Promise<Document>} Document found by id. If doesn't exist, throws an error.
 */
async function validateId(Model, id) {
	const document = await Model.findById(id)

	if (!document) throw new Error('주어진 아이디와 일치하는 대상이 없습니다.')

	return document
}

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
		if (key === 'description') {
			newBook[key] = await getBookDescription(searchResult.link)
		} else {
			newBook[key] = value
		}
	}
	return await newBook.save()
}

export { validateId, saveBook }