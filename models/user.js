import mongoose from 'mongoose'
import { User } from '../models/index.js'

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
    level: {
        type: Number,
        default: 1
    },
    exp: {
        type: Number,
        default: 0
    }
})
// 특정상황에 따른 exp 더하기(상황에 따라 exp` 달라짐) -> exp 저장

// levelup 가능한지 현재exp, 필요exp check(현재 레벨에 따라 필요exp 달라짐) -> 현재 exp > 필요 exp 이면 levelUp 호출
// levelUp 후에 남는 경험치는 exp에 넘겨줌(레벨업이 두번되는 경우가 있을까? 없도록 설계하는게 비즈니스 로직으로 맞다고 생각한다.) -> levelup저장, exp 저장
async function checkExpAndLevelup() {
    const requiredExp = 3**(1.06^(this.level - 1))
    console.log(requiredExp)
    if (this.exp >= requiredExp){
        this.level += 1
        this.exp -= requiredExp
        console.log("exp", this.exp)
        console.log("exp", this.level)
    }
}

userSchema.post('save', {document: true}, checkExpAndLevelup )

for(const path in userSchema.paths) {
	if (path === '_id') continue
	// const property = userSchema.paths[path]
	// property.required(true)
}

export default mongoose.model('User', userSchema)