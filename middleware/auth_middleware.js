import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

/**
 * Returns middleware that validate JWT to check whether user is logged in
 * @param loginRequired {boolean} If false, treat the user as not logged in
 * @returns {(function(*=, *, *): Promise<*|undefined>)|*}
 */
const authMiddleware = (loginRequired) => {
	/**
	 * Validates headers from client.
	 * @param req
	 * @returns {mongoose.Schema.Types.ObjectId|Error} userId - user's ID from JWT | Error
	 */
	const validateToken = (req) => {
		// Check header

		const authorization = req.headers?.authorization
		if (!authorization) throw new Error('헤더에 authorization 이 없습니다.')

		// Check token

		let tokenScheme, tokenValue
		try {
			[tokenScheme, tokenValue] = authorization.split(' ')
		} catch (e) {
			console.error(e)
			return new Error('토큰 구조 분해를 실패했습니다.')
		}
		if (!tokenScheme || !tokenValue)
			return new Error('토큰 형식이나 토큰 값이 없습니다.')

		// Parse jwt token and get user's ID

		let userId
		try {
			userId = jwt.verify(tokenValue, process.env.TOKEN_KEY).userId
		} catch (e) {
			console.error(e)
			return new Error('JWT 토큰 검증을 실패했습니다.')
		}

		return userId
	}

	return async (req, res, next) => {
		try {
			const userId = validateToken(req)

			const user = await User.findById(userId)

			if (!user)
				new Error('DB에 JWT 토큰과 일치하는 유저의 정보가 없습니다.')

			res.locals.user = user
			return next()
		} catch (e) {
			console.error(e)

			if (!loginRequired) {
				res.locals.user = null
				return next()
			}

			return next(e)
		}
	}
}

export default authMiddleware 
