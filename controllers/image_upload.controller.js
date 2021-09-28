import { uploadFile } from '../s3.js'
import fs from 'fs/promises'

export default class ImageUploadController {

	static async uploadImage(req, res, next) {
		try {
			const { file } = req

			if (!file) return next()

			const { Location } = await uploadFile(file)
			res.locals.url = Location

			await fs.unlink(file.path)
			return next()
		} catch (err) {
			console.error(err)
			return next({ message: '이미지 업로드를 실패했습니다', status: 500 })
		}
	}
}