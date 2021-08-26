import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose

// todo: 오빈님 변수명같은거 같이 고민좀 부탁드립니다..
const trendSchema = new Schema(
	{
		trendingReviews: [
			{
				review: Types.ObjectId,
				point: Number,
			},
		],
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	}
)

export default model('Trend', trendSchema)