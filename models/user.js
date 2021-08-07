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
    exp: {
        type: Number,
        default: 0
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.methods.Levelup = () => {
    function requiredExp(level) {
        if(level = 0){
            return 0
        }
        return 3**(1.05^(level - 1))
    }
    
    function checkExpAndLevelup(user, level, sumRequiredExp){
        sumRequiredExp += requiredExp(level)
        if((user.exp - requiredExp(level - 1)) < sumRequiredExp){
            return level
            }
        return checkExpAndLevelup(level + 1, sumRequiredExp)
        
    }
    user = this.toJSON
    let level = 1
    let sumRequiredExp = 0
    return checkExpAndLevelup(user, level, sumRequiredExp)
}

for(const path in userSchema.paths) {
	if (path === '_id') continue
	// const property = userSchema.paths[path]
	// property.required(true)
}

export default mongoose.model('User', userSchema)