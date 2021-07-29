import axios from 'axios'
import { parseString } from 'xml2js'

const searchBooks = async (target,query,client_id, client_secret) => {
    const api_url = `https://openapi.naver.com/v1/search/book_adv.xml?${target}=` + encodeURI(query)
        const result = await axios({
            method: 'get',
            url : api_url,

            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret
            }
        }) // todo 프로미스로 이어 보자
        let searchList;
        parseString(result.data, (err,result) => {
            if(err){
                return console.log("sth wrong")
            }
            searchList = result.rss.channel[0].item
        })
        return searchList

}

export default searchBooks
