import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true,
	},
	providerKey: {
		type: String,
		required: true,
	},
	provider: {
		type: String,
		required: true,
	}
})

export default mongoose.model('User', userSchema)