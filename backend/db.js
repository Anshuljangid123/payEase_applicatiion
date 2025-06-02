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
   
   firstName : {
    type : String , 
    required : true,
    trim : true,
    maxLength : 50
   } , 
   lastName : {
    type : String , 
    required : true,
    trim : true,
    maxLength : 50
   },
   email : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true,
    minLength : 3 ,
    maxLength : 30
   },
   password : {
    type : String , 
    required : true ,
    minLength : 6
   } 
})

/**
 Accounts table
The Accounts table will store the INR balances of a user.
 */

const accountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    } , 
    balance : {
        type : Number  ,
        required : true
    }
})

const Account = mongoose.model('Account' , accountSchema);

//create a model from the schema 
const User = mongoose.model('User' , userSchema);

module.exports = {
    User , 
    Account
};