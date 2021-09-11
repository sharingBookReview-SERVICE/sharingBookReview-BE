import mongoose from 'mongoose'

const { isValidObjectId } = mongoose

export default class SuperController {
	/**
	 * Validate and then return IDs in parameters.
	 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
	 * @returns {{reviewId, collectionId, commentId}}
	 * @protected
	 */
	static _getIds(req) {
		const { reviewId, collectionId, commentId } = req.params

		if (reviewId && !isValidObjectId(reviewId))
			if (collectionId && !isValidObjectId(collectionId)) throw { message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 }
		if (commentId && !isValidObjectId(commentId)) throw { message: '유효하지 않은 댓글 아이디입니다.', status: 400 }

		return { reviewId, collectionId, commentId }
	}

	/**
	 * Check if author of a document and current logged in user are the same.
	 * @param author {mongoose.Schema.Types.ObjectId} - Author of a document
	 * @param currentUserId {mongoose.Schema.Types.ObjectId} - Current logged in user
	 * @protected
	 */
	static _validateAuthor(author, currentUserId) {
		if (String(author) !== String(currentUserId)) throw{ message: '현 사용자와 댓글 작성자가 일치하지 않습니다.', status: 403 }
	}
}