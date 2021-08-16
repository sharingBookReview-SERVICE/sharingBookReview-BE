import { User } from './index.js'

/**
 * Apply (un)like.
 * @param Model {mongoose.Model}
 * @param documentId {any}
 * @param userId {any}
 * @returns {Promise<Document<*|*|Error>>}
 */
const likeUnlike = async (Model, documentId, userId) => {
	try {
		let document =
			(await Model.findById(documentId)) ??
			new Error('존재하지 않는 리뷰입니다.')

		await User.getExpAndLevelUp(document.user, 'like')

		document.getMyLike(userId)
			? document.liked_users.pull(userId)
			: document.liked_users.push(userId)

		await document.save()

		document = Model.processLikesInfo(document, userId)
		return document
	} catch (e) {
		return e
	}
}

export { likeUnlike }