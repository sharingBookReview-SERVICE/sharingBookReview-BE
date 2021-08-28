import { User, Alert } from './index.js'
import moment from 'moment-timezone'
import 'moment/locale/ko.js'

/**
 *
 * @param Model
 * @param parameterName
 * @returns {Promise<(function(*, *, *): (*|undefined))|*>}
 */
const likeUnlike = (Model, parameterName) => {
	return async (req, res, next) => {
		const { _id: userId } = res.locals.user
		const documentId = req.params[parameterName + 'Id']

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

            if(userId !== document.user && document.myLike === true){
                const alert = new Alert({
                    type: 'like',
                    sender: userId,
                    reviewId: documentId
                })
                await User.findByIdAndUpdate(document.user, {
                    $push: {
                        alerts: alert,
                    },
                })
            }


			res.json(({ [parameterName]: document }))
		} catch (e) {
			console.error(e)
			return next(new Error('좋아요/좋아요 취소를 실패했습니다.'))
		}
	}
}

// virtual로 한국시간을 만들고, 현재부터 얼마나 지났는지를 fromNow로 보여줌
// import 'moment/locale/ko.js' 를 이용해 한국어를 지원
const KoreaTime = (schema) => {
    schema.virtual('koreaTime').get(function() {
        return moment.tz(this.created_at, "Asia/Seoul").fromNow()
    })
}


export { likeUnlike, KoreaTime }