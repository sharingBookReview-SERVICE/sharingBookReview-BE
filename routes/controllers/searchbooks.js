import axios from 'axios'
import { parseString } from 'xml2js'
import Book from '../../models/book.js'

const searchBooks = (target, query) => {

    const checkBookDatabase = async (target, query) =>{
        const databaseBook = await Book.find({ target : query })
        console.log(databaseBook)
    }
    
    const searchNaverBookApi = async() =>{
    
    }
    
    const saveBookinfo = async () =>{
    
    }
    
    const showBookDatabase = async() =>{
    
    }
    let searchList = ['dummy']
    return searchList
}


export default searchBooks
