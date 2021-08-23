import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose
import { KoreaTime } from './utilities.js'

const followSchema = new Schema({
    // follow를 send하는 user. follow한 상대의 게시물을 피드에서 볼 수 있다. receiver를 상대로 follow 하기, follow 취소 가능
	sender: { type: Types.ObjectId, ref: 'User', immutable: true },
    // follow를 receive하는 user. sender를 상대로 follow 삭제 가능
	receiver: { type: Types.ObjectId, ref: 'User', immutable: true },
	created_at: { type: Date, default: Date.now },
})

KoreaTime(followSchema)

// todo 왜 안되는지 규명하기(pull request 125참조)
// class Follow {
// 	static checkFollowing = async (myUserId, othersUserId) => {
//         return Boolean(await this.findOne({sender:myUserId, receiver: othersUserId}))
// 	}
// }

// followSchema.loadClass(Follow)

followSchema.statics.checkFollowing = async function(instance, sender, receiver) {
    const is_follow = Boolean(await this.findOne({sender, receiver}))
    if(instance instanceof mongoose.Model){
        instance = instance.toJSON()
    }
    instance.is_follow = is_follow
    return instance
}

export default model('Follow', followSchema)