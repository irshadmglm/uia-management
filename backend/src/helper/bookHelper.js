

const  db = require('../config/connection');
const collections = require('../config/collection');
const axios = require('axios');
const xlsx = require('xlsx');
const fs = require('fs');

const fileUrl = 'https://docs.google.com/spreadsheets/d/1clbXTFNsHLEy4MR9MDgi-9MQiS88Fh9S7M0dHFaJsYA/export?format=xlsx';
const filePath = 'yourfile.xlsx';


module.exports = {
   
    getBooks:function(){
        return new Promise(async(resolve,reject)=>{
            try {
               let books = await db.get().collection(collections.BOOK_COLLECTION).find().sort({bookNumber: 1}).toArray()
               resolve(books);
            } catch (error) {
                reject(error);
            }
        })
    },
    addBook: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.title || !data.bookNumber) {
                    throw new Error("Missing required fields: title, author, or bookNumber");
                } 
                data.bookNumber = parseInt(data.bookNumber, 10)
                let book = await db.get().collection(collections.BOOK_COLLECTION).findOne({bookNumber:data.bookNumber})
                if(book){
                    throw new Error(" This  bookNumber is already registered");
                }
                data.status = 'available';
    
                const result = await db.get().collection(collections.BOOK_COLLECTION).insertOne(data);
    
                resolve({ success: true, message: "Book added successfully", insertedId: result.insertedId });
            } catch (error) {
                reject({ success: false, error: error.message });
            }
        });
    },
    
    
    updateBook:()=>{
        return new Promise((resolve,reject)=>{
            
        })
    },
    deleteBook:()=>{
        return new Promise((resolve,reject)=>{
            
        })
    },
    exeldata:function(){
axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  })
    .then((response) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
  
      writer.on('finish', async() => {
        const workbook = xlsx.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        
        const transformedData = data.map((item) => ({
            bookNumber: item['ASS. NO'],
            title: item['NAME OF BOOKS'],
            author: item['NAME OF AUTHOR'],
            status: 'available'
          }));
        await db.get().collection(collections.BOOK_COLLECTION).insertMany(transformedData);
      });
  
      writer.on('error', (err) => {
        console.log('Error downloading file: ', err);
      });
    })
    .catch((error) => {
      console.error('Error downloading the Excel file: ', error);
    });
    },
}