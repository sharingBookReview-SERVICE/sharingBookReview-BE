/**
 * Save all books needed to be indexed for tagging system.
 */
import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { KoreaTime } from './utilities.js'

const changesIndexSchema = new Schema(
	{
	isbn: Number,
	created_at: { type: Date, default: Date.now, },
})

KoreaTime(changesIndexSchema)

export default model('ChangesIndex', changesIndexSchema)