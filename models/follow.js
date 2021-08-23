import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose
import { KoreaTime } from './utilities.js'

const followSchema = new Schema({
	sender: { type: Types.ObjectId, ref: 'User', immutable: true },
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