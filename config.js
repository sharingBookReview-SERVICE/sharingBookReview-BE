import dotenv from 'dotenv'
import path from 'path'

const config = function() {
    if(process.env.NODE_ENV === 'production'){
        dotenv.config({
            path: path.join(process.cwd(), './config/server.env')
        })
    } else if(process.env.NODE_ENV === 'test'){
        dotenv.config({
            path: path.join(process.cwd(), './config/test.env')
        })
    }else{
        dotenv.config({
            path: path.join(process.cwd(), './config/dev.env')
        })
    }
}

export default config