const mongoose = require("mongoose");
const { string } = require("zod");

const connectDB = async () => {
    try {

        await mongoose.connect("mongodb+srv://anshuljan2003:nHy9vfJcvLSZjjpz@cluster0.avumo0n.mongodb.net/paytm");
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        
    }
};
connectDB();

const userSchema = mongoose.Schema({
   username : {
    type : String,
    require : true,
    unique : true,
    trim : true,
    lowercase : true,
    minLength : 3 ,
    maxLength : 30
   },
   password : {
    type : String , 
    require : true ,
    minLength : 6
   } , 
   firstName : {
    type : String , 
    require : true,
    trim : true,
    maxLength : 50
   } , 
   lastName : {
    type : String , 
    require : true,
    trim : true,
    maxLength : 50
   }
})

//create a model from the schema 
const User = mongoose.model('User' , userSchema);

module.exports = {
    User
};