import { uploadFile } from '../s3.js'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

export default class ImageUploadController {

	static async uploadImage(req, res, next) {
		const { file } = req
		if (file === undefined) {
			return next()
		}
		const result = await uploadFile(file)
		await unlinkFile(file.path)
		res.locals.url = result.Location
		return next()

	}
}