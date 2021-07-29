import axios from 'axios'
import convert from 'xml2js'

const searchBooks = async (target,query,client_id, client_secret) => {
    const api_url = `https://openapi.naver.com/v1/search/book_adv.xml?${target}=` + encodeURI(query)
        let result = await axios({
            method: 'get',
            url : api_url,

            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret
            }
        })
        const resultData = result.data
        return resultData

}

export default searchBooks
