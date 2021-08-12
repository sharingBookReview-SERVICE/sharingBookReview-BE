import { uploadFile } from "../s3.js"
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink) 

const reviewImage = {
    uploadImage: async(req, res, next) => {
        const file = req.file
        if (file === undefined) {
            return next()
        }
        const result = await uploadFile(file)
        await unlinkFile(file.path)
        res.locals.url = result.Location
        return next()
        
    }
}

export default reviewImage