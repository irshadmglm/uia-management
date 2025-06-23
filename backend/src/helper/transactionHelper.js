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
                        from: 'users', 
                        localField: 'studentId',  
                        foreignField: 'studentId',  
                        as: 'userInfo'  
                      }
                    },
                    
                    {
                      $lookup: {
                        from: 'books',  
                        localField: 'bookId',  
                        foreignField: '_id',  
                        as: 'bookInfo'  
                      }
                    },
                  
                    {
                      $unwind: {
                        path: '$userInfo',
                        preserveNullAndEmptyArrays: true 
                      }
                    },
                    {
                      $unwind: {
                        path: '$bookInfo',
                        preserveNullAndEmptyArrays: true 
                      }
                    },
                  
                    
                    {
                      $project: {
                        _id: 1,  
                        studentName: '$userInfo.studentName', 
                        studentId: '$userInfo.studentId', 
                        bookTitle: '$bookInfo.title', 
                        bookNumber: 1,  
                        borrowDate: 1,  
                        dueDate: 1  
                      }
                    }
                  ]).sort({ borrowDate: -1 }).toArray();
                  
                  
                if(borrowedBooks){
                    resolve(borrowedBooks);
                }
            } catch (error) {
                reject()
            }
        })
    }
}