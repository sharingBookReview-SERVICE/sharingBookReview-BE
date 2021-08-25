import mongoose from 'mongoose'
const { Schema, Types, model } = mongoose

const noticeSchema = new Schema({
    title: String,
	content: String ,
	created_at: { type: Date, default: Date.now, },
})

export default model('Notice', noticeSchema)