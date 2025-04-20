const db = require('../config/connection');
const collections = require('../config/collection')
module.exports = {
    borrow: (bookNumber, studentId) => {
        return new Promise(async (resolve, reject) => {
          try {
        
            let book = await db.get().collection(collections.BOOK_COLLECTION).findOne({ bookNumber: bookNumber });
            if (!book) {
              reject('Book not found');
              return;
            }
      
            if (book.status !== 'available') {
              reject('Book not available');
              return;
            }
      
            let student = await db.get().collection(collections.USER_COLLECTION).findOne({ studentId: studentId });
            if (!student) {
              reject('Student not registered');
              return;
            }
            studentName = student.studentName;
            const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
            await db.get().collection(collections.BOOK_COLLECTION).updateOne(
              { bookNumber: bookNumber },
              {
                $set: {
                  status: 'borrowed',
                  borrowedBy: studentId,
                  studentName: studentName,
                  dueDate: dueDate,
                },
              }
            );
      
            book = await db.get().collection(collections.BOOK_COLLECTION).findOne({ bookNumber: bookNumber });
      
            await db.get().collection(collections.TRANSACTION_COLLECTION).insertOne({
              bookId: book._id,
              bookNumber: bookNumber,
              borrowDate: new Date(),
              dueDate: book.dueDate,
              studentId: studentId,
              returned: false 
            });
      
            resolve('Book borrowed successfully');
          } catch (error) {
            reject(`Error borrowing book: ${error.message}`);
          }
        });
      },
      returnBook: (bookNumber) => {
        return new Promise(async (resolve, reject) => {
          bookNumber = parseInt(bookNumber, 10)
            try {
                let book = await db.get().collection(collections.BOOK_COLLECTION).findOne({ bookNumber: bookNumber });
    
                if (!book) {
                    reject('Book not found');
                    return;
                }
                await db.get().collection(collections.BOOK_COLLECTION).updateOne(
                    { bookNumber: bookNumber },
                    {
                        $set: {
                            status: 'available',   
                            borrowedBy: "",     
                            studentName: "",     
                            dueDate: "",    
                        },
                    }
                );
    
                await db.get().collection(collections.TRANSACTION_COLLECTION).updateOne(
                    { bookNumber: bookNumber, returned: false },
                    {
                        $set: {
                            returned: true,
                            returnDate: new Date(), 
                        },
                    }
                );
    
                resolve({success: true, message: 'Book returned successfully'});
            } catch (error) {
                console.error({success: false, message:'Error while returning book:', error});
                reject('Failed to return the book');
            }
        });
    },
    
    borrowedBooks:()=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let borrowedBooks = await db.get().collection(collections.TRANSACTION_COLLECTION).aggregate([
                    {
                        $match:{
                            returned: false
                        }
                    },
                    {
                      $lookup: {
                        from: 'users',  // Assuming the users collection is named 'users'
                        localField: 'studentId',  // The field in the transaction collection
                        foreignField: 'studentId',  // The field in the users collection
                        as: 'userInfo'  // The alias for the joined user data
                      }
                    },
                    
                    // Lookup book information using bookId
                    {
                      $lookup: {
                        from: 'books',  // Assuming the books collection is named 'books'
                        localField: 'bookId',  // The field in the transaction collection
                        foreignField: '_id',  // The field in the books collection
                        as: 'bookInfo'  // The alias for the joined book data
                      }
                    },
                  
                    // Unwind user and book arrays (since the result of $lookup is an array)
                    {
                      $unwind: {
                        path: '$userInfo',
                        preserveNullAndEmptyArrays: true  // In case there's no matching user
                      }
                    },
                    {
                      $unwind: {
                        path: '$bookInfo',
                        preserveNullAndEmptyArrays: true  // In case there's no matching book
                      }
                    },
                  
                    
                    {
                      $project: {
                        _id: 1,  // Exclude _id from the output
                        studentName: '$userInfo.studentName',  // Assuming the user's name is stored as 'name' in the 'users' collection
                        studentId: '$userInfo.studentId', 
                        bookTitle: '$bookInfo.title',  // Assuming the book's title is stored as 'title' in the 'books' collection
                        bookNumber: 1,  // Include bookNumber from the transaction
                        borrowDate: 1,  // Include borrowDate from the transaction
                        dueDate: 1   // Include dueDate from the transaction
                      }
                    }
                  ]).sort({ borrowDate: -1 }).toArray();
                  
                  console.log(borrowedBooks);
                  
                if(borrowedBooks){
                    resolve(borrowedBooks);
                }
            } catch (error) {
                reject()
            }
        })
    }
}