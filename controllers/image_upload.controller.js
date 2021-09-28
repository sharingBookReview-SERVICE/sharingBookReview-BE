import { uploadFile } from '../s3.js'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

export default class ImageUploadController {

	static async uploadImage(req, res, next) {
		const { file } = req

		if (!file) return next()

		const { Location } = await uploadFile(file)
		res.locals.url  = Location

		await unlinkFile(file.path)
		return next()

	}
}