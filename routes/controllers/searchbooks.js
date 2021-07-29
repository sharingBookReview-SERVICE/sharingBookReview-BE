import axios from 'axios'

const client_id = process.env.BOOK_API_CLIENT_ID
const client_secret = process.env.BOOK_API_CLIENT_SECRET

exports.searchbooks = (req,res) => {
    const api_url = "https://openapi.naver.com/v1/search/book.json?query=%EC%A3%BC%EC%8B%9D&display=10&start=1"
}


