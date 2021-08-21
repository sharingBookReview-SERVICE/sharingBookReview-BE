import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

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
}

export default authMiddleware 
