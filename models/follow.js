import mongoose from 'mongoose'

const followSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
    },
    created_at: {
		type: Date,
		default: Date.now,
	},
})
// todo 왜 안되는지 규명하기
// class Follow {
// 	static checkFollowing = async (myUserId, othersUserId) => {
//         return Boolean(await this.findOne({sender:myUserId, receiver: othersUserId}))
// 	}
// }

// followSchema.loadClass(Follow)

followSchema.statics.checkFollowing = async function(myUserId, othersUserId) {
    return Boolean(await this.findOne({sender: myUserId, receiver: othersUserId}))
}

export default mongoose.model('Follow', followSchema)