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
		const { bookId, reviewId, collectionId, commentId } = req.params

		// ISBN is 10 digits in U.S. and 13 elsewhere.
		if (bookId && (bookId.length === 10 || bookId.length === 13)) throw { message: '유효하지 않은 ISBN 입니다. (ISBN 은 10자리 혹은 13자리여야합니다.)', status : 400 }
		if (reviewId && !isValidObjectId(reviewId)) throw { message: '유효하지 않은 리뷰 아이디입니다.', status: 400 }
		if (collectionId && !isValidObjectId(collectionId)) throw { message: '유효하지 않은 컬렉션 아이디입니다.', status: 400 }
		if (commentId && !isValidObjectId(commentId)) throw { message: '유효하지 않은 댓글 아이디입니다.', status: 400 }

		return { bookId, reviewId, collectionId, commentId }
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