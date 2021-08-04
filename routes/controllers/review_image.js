const reviewImage = {
    uploadImage: async( req, res ) => {
        const image = req.file.path
        
        if (image === undefined) {
            return next(new Error("이미지가 존재하지 않습니다."))
        }

        res.sendStatus(200)
    }

}

export default reviewImage