import { unlink } from 'fs/promises'
import { createReadStream } from 'fs'
import S3 from 'aws-sdk/clients/s3.js'


import dotenv from 'dotenv'

dotenv.config()
export default class ImageUploadController {
	static async uploadImage(req, res, next) {
		try {
			const { file } = req

			if (!file) return next()

			const { Location } = await ImageUploadController.#uploadFileToS3(file)
			res.locals.url = Location

			await unlink(file.path)
			return next()
		} catch (err) {
			console.error(err)
			return next({ message: '이미지 업로드를 실패했습니다', status: 500 })
		}
	}

	static async #uploadFileToS3(file) {
		const s3 = new S3({
			region: process.env.AWS_BUCKET_REGION,
			accessKeyId: process.env.AWS_ACCESS_KEY,
			secretAccessKey: process.env.AWS_SECRET_KEY,
		})
		const fileStream = createReadStream(file.path)
		const uploadParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Body: fileStream,
			Key: file.filename,
		}

		return s3.upload(uploadParams).promise()
	}
}