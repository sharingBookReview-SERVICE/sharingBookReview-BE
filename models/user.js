import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
	},
	providerKey: {
		type: String,
	},
	provider: {
		type: String,
		enum: ['Naver']
	}
})

for(const path in userSchema.paths) {
	if (path === '_id') continue
	const property = userSchema.paths[path]
	property.required(true)
}

export default mongoose.model('User', userSchema)