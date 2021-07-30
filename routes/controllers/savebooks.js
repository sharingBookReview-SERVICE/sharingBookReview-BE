import Book from '../../models/book.js'

const saveBooks = async (bookId, book) => {
    const bookExist = await Book.findById(bookId)
    if (bookExist == null){
        const newBook = new Book
        for (const [key,value] of Object.entries(book)){            
            newBook[key] = value
            }
        await newBook.save()
        }
}

export default saveBooks
