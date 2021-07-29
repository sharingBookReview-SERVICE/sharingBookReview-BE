import axios from 'axios'

const searchBooks = async (req,res) => {
    const api_url = "https://openapi.naver.com/v1/search/book_adv.xml"
        let result = await axios({
            method: 'get',
            url : api_url,

            params: {
                target: query
            },
            header: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret
            }
        })
        
        const resultData = result.data
        const resultMessage = result.data.message

        console.log(reuslt)
        console.log(resultMessage)
        return resultData

}

export default searchBooks
