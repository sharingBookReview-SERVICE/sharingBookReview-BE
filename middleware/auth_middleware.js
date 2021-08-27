import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import {validateToken} from '../controllers/utilities.js'

/**
 * Returns middleware that validate JWT to check whether user is logged in
 * @param loginRequired {boolean} If false, treat the user as not logged in
 * @returns {(function(*=, *, *): Promise<*|undefined>)|*}
 */
const authMiddleware = (loginRequired) => {

	return async (req, res, next) => {
		try {
			const userId = validateToken({req})

			const user = await User.findById(userId)

			if (!user)
				new Error('DB에 JWT 토큰과 일치하는 유저의 정보가 없습니다.')

			res.locals.user = user
			return next()
		} catch (e) {
			console.error(e.message)

			if (!loginRequired) {
				res.locals.user = null
				return next()
			}

			return next(e)
		}
	}
}

export default authMiddleware 
