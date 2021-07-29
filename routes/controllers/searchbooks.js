import axios from 'axios'

exports.searchBooks = async (req,res) => {
    const api_url = "https://openapi.naver.com/v1/search/book.json?query=%EC%A3%BC%EC%8B%9D&display=10&start=1"
        let result = await axios({
            method: 'get',
            url : api_url,

            params: {
                query: req.query.query
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


