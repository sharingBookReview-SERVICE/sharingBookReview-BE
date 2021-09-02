import { Review, Book, Follow } from '../models/index.js'
import { getBookDescription } from './crawl.js'
import jwt from 'jsonwebtoken'

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

/**
	 * Validates headers from client.
	 * @param {object<req,token>}
	 * @returns {mongoose.Schema.Types.ObjectId|Error} userId - user's ID from JWT | Error
	 */
const validateToken = ({req, token}) => {
    // token 또는 req 받을 경우
    if(!req && !token) throw new Error('req, token 중 하나는 존재해야합니다.')
    const authorization = req ? req.headers?.authorization : token
    if (!authorization.length) throw new Error('헤더에 authorization 이 없습니다. loginRequired 가 false 일 경우 비 회원으로 진행합니다.')

    // Check token
    let tokenScheme, tokenValue
    try {
        [tokenScheme, tokenValue] = authorization.split(' ')
    } catch (e) {
        console.error(e)
        return new Error('토큰 구조 분해를 실패했습니다.')
    }
    if (tokenValue === 'null') throw new Error('토큰 값이 null 입니다. loginRequired 가 false 일 경우 비 회원으로 진행합니다.')
    if (!tokenScheme || !tokenValue)
        return new Error('토큰 형식이나 토큰 값이 없습니다.')

    // Parse jwt token and get user's ID

    let userId
    try {
        userId = jwt.verify(tokenValue, process.env.TOKEN_KEY).userId
    } catch (e) {
        console.error(e)
        if(e.name === 'TokenExpiredError'){
            throw { message : 'JWT 토큰의 유효기간이 만료되었습니다.' , status : 498}
        }
        return new Error('JWT 토큰 검증을 실패했습니다.')
    }

    return userId
}

async function showLikeFollowBookMarkStatus(reviews, userId) {

    let result = reviews.map((review) =>
        Review.processLikesInfo(review, userId)
    )
    result = await Promise.all(
        result.map((review) => Review.bookmarkInfo(review, userId))
    )
    result = await Promise.all(
        result.map((review) =>
            Follow.checkFollowing(review, userId, review.user)
        )
    )

	return result
}

export { validateId, saveBook, validateToken, showLikeFollowBookMarkStatus }