import { uploadFile } from '../s3.js'
import fs from 'fs/promises'

export default class ImageUploadController {

	static async uploadImage(req, res, next) {
		const { file } = req

		if (!file) return next()

		const { Location } = await uploadFile(file)
		res.locals.url  = Location

		await fs.unlink(file.path)
		return next()

	}
}