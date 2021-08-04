import { uploadFile, getFileStream } from "../../s3.js"
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink) 

const reviewImage = {
    uploadImage: async(req, res, next) => {
        const file = req.file
        console.log(file)
        if (file === undefined) {
            return next(new Error("이미지가 존재하지 않습니다."))
        }
        const result = await uploadFile(file)
        await unlinkFile(file.path)
        console.log(result)
        
        return res.json({imagePath: `/api/users/images/${result.Key}`})
    },
    getImage: (res, req) => {
        const key = req.params.key
        const readStream = getFileStream(key)

        readStream.pipe(res)
    }
}

export default reviewImage