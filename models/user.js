import mongoose from 'mongoose'

const { Schema, Types, model } = mongoose
import expList from '../exp_list.js'
import { Follow, User } from './index.js'
import { alertSchema } from './alert.js'

const userSchema = new Schema({
	nickname: String,
	providerKey: String,
	provider: { type: String, enum: ['naver', 'kakao', 'google'] },
	level: { type: Number, default: 1 },
	exp: { type: Number, default: 0 },
	profileImage: { type: String, default: 'image_1' },
	own_image: { type: [String], default: ['image_1'] },
	// True if user received treasure. False if user can receive treasure
	treasure: { type: Boolean, default: false },
    bookmark_reviews: {type: [Types.ObjectId], ref: 'Review'},
	read_reviews: [
		{
			_id: Types.ObjectId,
			created_at: Date,
		},
	],
	read_collections: [
		{
			_id: Types.ObjectId,
			created_at: Date,
		},
	],
    alerts: [alertSchema],
    check_alert: { type : Boolean, default: false}
})

// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.statics.getExpAndLevelUp = async function (userId, event) {
	const user = await this.findById(userId)
	// event에 따른 경험치를 획득
	user.exp += expList[event]
	// Required experience to next level.
	const requiredExp = 3 * 1.05 ** (user.level - 1)

	// Level up
	if (user.exp >= requiredExp) {
		user.level++
		user.exp -= requiredExp
        if(user.level === 2 || user.level % 5 === 0){
            user.treasure = true
        }
	}

	await user.save()

	return user.treasure
}

userSchema.statics.deleteExp = async function (userId, event) {
	const user = await this.findById(userId)

	user.exp -= expList[event]

	await user.save()
}

userSchema.methods.followCount = async function() {
    const user = this.toJSON()
    user.followingCount = (await Follow.find({sender: this._id})).length
    user.followerCount = (await Follow.find({receiver: this._id})).length

    return user
}



export default model('User', userSchema)