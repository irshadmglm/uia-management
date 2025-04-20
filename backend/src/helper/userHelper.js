const db = require('../config/connection');
const collections = require('../config/collection');
module.exports = {
     addUser : (data) => {
        return new Promise(async (resolve, reject) => {
          data.selectedBatch = parseInt(data.selectedBatch, 10);
          data.rollNumber = parseInt(data.rollNumber, 10);
  
          try {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({studentId: data.studentId});
            if(user){
                throw new Error("This student is already registered.")
            }
            let result = await db.get().collection(collections.USER_COLLECTION).insertOne(data);
      
            resolve({ success: true, message: "Student registered successfully", insertedId: result.insertedId });
          } catch (error) {
            reject({ success: false, error: error.message });
          }
        });
      },
    apdateUser:()=>{
        return new Promise((resolve,reject)=>{

        })
    },
    deleteUser:()=>{
        return new Promise((resolve,reject)=>{

        })
    },
    getUser:()=>{
        return new Promise(async(resolve,reject)=>{
        try {
          let users = await db.get().collection(collections.USER_COLLECTION).find().sort({selectedBatch: 1, rollNumber: 1, division: 1}).toArray();
          if(users){
            resolve(users);
          }
        } catch (error) {
          reject(error);
        }
        })
    }
}