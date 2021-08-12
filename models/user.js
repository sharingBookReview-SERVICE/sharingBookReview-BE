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
		enum: ['naver','kakao','google']
	},
    level:{
        type: Number,
        default: 1
    },
    exp: {
        type: Number,
        default: 0
	},
    followingCount:{
        type: Number,
        default: 0
    },
    followerCount: {
        type: Number,
        default: 0
    },
    profileImage:{
        type: String,
        default:"https://booknetworkservice.s3.ap-northeast-2.amazonaws.com/6dd5a982d719bdc3/%E1%84%81%E1%85%AE%E1%86%B7%E1%84%81%E1%85%AE%E1%84%82%E1%85%B3%E1%86%AB+%E1%84%8B%E1%85%A1%E1%84%86%E1%85%A6%E1%84%87%E1%85%A1-120px.svg"
    },
    own_image:{
        type: [String]
    }
})
// todo following, followerCount virtual로 변환
// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.statics.getExpAndLevelUp = async function(userId, event) {
    const user = await this.findById(userId)
    let reaching_10 = false
    // event에 따른 경험치를 획득
    user.exp += expList[event]
    // 필요 경험치 계산
    let requiredExp = 3 * (1.05**(user.level - 1))
    // 현재 경험치가 필요 경험치보다 크거나 같을때, 레벨업, 경험치 수정
    if(user.exp >= requiredExp){
        user.level += 1
        user.exp -= requiredExp
        if(user.level % 10 === 0){
            reaching_10 = true
        }
    }
        await user.save()

        return reaching_10
}


export default mongoose.model('User', userSchema)