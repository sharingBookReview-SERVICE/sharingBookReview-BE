import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = (req, res, next) => {
    try{
        const { authorization } = req.headers;

        const tokenScheme = authorization.split(" ")[0]
        const tokenValue = authorization.split(" ")[1]
    
        if (authorization === null || authorization === undefined) {
			return next(new Error('로그인을 위한 정보가 존재 하지 않습니다.'))
		}
        if (tokenScheme !== "Bearer"){
            return next(new Error("토큰 인증 방식이 잘못되었습니다."))
        }
    
        const user = jwt.verify(tokenValue, process.env.TOKEN_KEY)
        const { userId } = user
    
        User.findById(userId)
        .then((result) => {
            res.locals.user = result
            next()
        })
        .catch((e) => {
            return next(new Error("유저 정보가 존재하지 않습니다."))
        })
    }catch (e){
        return next(new Error("인증에 실패했습니다."))
    }
    
}

export default authMiddleware 
