import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    try{
        if (authorization === undefined || authorization === null){
            let result = new Object
            result._id = 'nonLogin'
            res.locals.user = result
            return next()
        }
    }catch(e){
        return next(new Error("비로그인 인증에 실패했습니다."))
    }

    const tokenScheme = authorization.split(" ")[0]
    const tokenValue = authorization.split(" ")[1]
    
    try{    
        if (tokenScheme !== 'Bearer') {
			return next(new Error('토큰 인증 방식이 잘못되었습니다.'))
		}
        if (tokenValue !== 'Null') {
			return next(new Error('토큰 벨류가 존재하지않습니다.'))
		}
    
        const user = jwt.verify(tokenValue, process.env.TOKEN_KEY)
        const { userId } = user
    
        User.findById(userId)
        .then((result) => {
            res.locals.user = result
            return next()
        })
        .catch((e) => {
            return next(new Error("유저 정보가 존재하지 않습니다."))
        })
    }catch (e){
        return next(new Error("인증에 실패했습니다."))
    }
    
}

export default authMiddleware 
