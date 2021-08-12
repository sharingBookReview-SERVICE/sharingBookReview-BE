import mongoose from 'mongoose'
import expList from '../exp_list.js'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
	},
	providerKey: {
		type: String,
	},
	provider: {
		type: String,
		enum: ['naver', 'kakao', 'google'],
	},
	level: {
		type: Number,
		default: 1,
	},
	exp: {
		type: Number,
		default: 0,
	},
	followingCount: {
		type: Number,
		default: 0,
	},
	followerCount: {
		type: Number,
		default: 0,
	},
	profileImage: {
		type: String,
		default: 'image_1',
	},
	own_image: {
		type: [String],
	},
	// 보물을 받은 상태이면 true, 보물을 획득해야하만 하는 상태는 false
	treasure: {
		type: Boolean,
		default: true,
	},
})
// todo following, followerCount virtual로 변환
// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.statics.getExpAndLevelUp = async function(userId, event) {
    const user = await this.findById(userId)
    let treasure = true
    // event에 따른 경험치를 획득
    user.exp += expList[event]
    // 필요 경험치 계산
    let requiredExp = 3 * (1.05**(user.level - 1))
    // 현재 경험치가 필요 경험치보다 크거나 같을때, 레벨업, 경험치 수정
    if(user.exp >= requiredExp){
        user.level += 1
        user.exp -= requiredExp
        if(user.level % 10 === 0){
            treasure = false
            user.treasure = treasure
        }
    }
        await user.save()

        return treasure
}

userSchema.statics.deleteExp = async function(userId, event) {
    const user = await this.findById(userId)

    user.exp -= expList[event]
    console.log(user.exp)
    await user.save()

}

export default mongoose.model('User', userSchema)