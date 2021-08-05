import { uploadFile } from "../../s3.js"
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink) 

const reviewImage = {
    uploadImage: async(req, res, next) => {
        const file = req.file
        if (file === undefined) {
            return next(new Error("이미지가 존재하지 않습니다."))
        }
        const result = await uploadFile(file)
        await unlinkFile(file.path)
        console.log(result)
        console.log(result.Location)
        res.locals.url = result.Location
        res.locals.body = req.body
        return next()
        
    }
}

export default reviewImage