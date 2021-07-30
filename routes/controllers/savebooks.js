import Book from '../../models/book.js'

const saveBook = async (object, bookId) => {
    const bookExist = await Book.findById(bookId)
    if (bookExist == null){
        const newBook = new Book
        for (const [key,value] of Object.entries(object)){            
            newBook[key] = value
            }
        await newBook.save()
        }
}

export default saveBook
