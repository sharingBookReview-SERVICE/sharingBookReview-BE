import mongoose from 'mongoose'
const { Schema, model } = mongoose
import expList from '../exp_list.js'

const userSchema = new Schema({
	nickname: String,
	providerKey: String,
	provider: { type: String, enum: ['naver', 'kakao', 'google'] },
	level: { type: Number, default: 1 },
	exp: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	followerCount: { type: Number, default: 0 },
	profileImage: { type: String, default: 'image_1' },
	own_image: { type: [String], default: ['image_1'] },
	// True if user received treasure. False if user can receive treasure
	treasure: { type: Boolean, default: false },
	read_reviews: [
		{
			reviewId: mongoose.Schema.Types.ObjectId,
			created_at: Date,
		},
	],
	read_collections: [
		{
			collectionId: mongoose.Schema.Types.ObjectId,
			created_at: Date,
		},
	],
})

// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.statics.getExpAndLevelUp = async function(userId, event) {
    const user = await this.findById(userId)
    // event에 따른 경험치를 획득
    user.exp += expList[event]
    // Required experience to next level.
	const requiredExp = 3 * 1.05 ** (user.level - 1)

	// Level up
	if (user.exp >= requiredExp) {
		user.level++
		user.exp -= requiredExp
		user.treasure = !(user.level % 10)
	}

	await user.save()

	return user.treasure
}

userSchema.statics.deleteExp = async function(userId, event) {
    const user = await this.findById(userId)

    user.exp -= expList[event]
    
    await user.save()

}

class User {
	refreshReadReviewsAndCollections() {
		/**
		 * 유저 안의 readReview s와 readCollections 를 조회해서 일주일이 지난 항목이 있으면 삭제한다.
		 *
		 * 본 메소드는 모두 상상속에 작성되었으며 반드시 실행테스트가 필요하다.
		 *
		 * 현재는 읽음 확인 기능이 없어서 테스트가 불용이하다.
		 */

		const deleteOldOnes = (arr) => {
			return arr.filter(item => {
				return new Date(item.created_at) < new Date(new Date() - 1000 * 60 * 60 * 24 * 7)
			})
		}

		this.readReviews = deleteOldOnes(this.read_reviews)
		this.readCollections = deleteOldOnes(this.read_collections)

	}
}

userSchema.loadClass(User)

export default model('User', userSchema)