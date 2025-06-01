
// api/v1/account
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware , async (req,res)=>{
    console.log("inside balance router")
    const account = await Account.findOne({
        userId : req.userId
    })

    res.json({
        balance : account.balance
    })
})

//2. An endpoint for user to transfer money to another account
//  Route: /api/v1/account/transfer
router.post("/transfer" , authMiddleware , async (req, res)=>{
    console.log("inside the transfer route ")
    const session = await mongoose.startSession();

    session.startTransaction(); // ____________start transaction ___________________

    const {amount , to} = req.body;
    // how much amount is need to be transfered to whome ? (name stirng i.e. userId   and amount )
    const account = await Account.findOne({
        userId : req.userId
    }).session(session) //____________________


    if(!account || account.balance < amount){
        await session.abortTransaction() // ________________--
        return res.status(400).json({
            message : "insufficient balance"
        })
    }

    const toAccount = await Account.findOne({ 
        userId : to
    }).session(session)//___________________

    if(!toAccount){
        await session.abortTransaction()//___________
        return res.status(400).json({
            message : "invalid account can't transfer money transfer failed check for valid acount"
        })
    }

    //now making of the transactions 

    await Account.updateOne({
        userId : req.userId
    },{
        $inc :{
            balance : -amount
        }
    }).session(session) // debit concept  // ---------------------------

    await Account.updateOne({ // credit concept
        userId : to
    },{
        $inc : {
            balance: amount
        }
    }).session(session) // -----------------
    
    await session.commitTransaction(); // ________________commit the transaction___________

    res.json({
        message : "transfer successull"
    })

})

module.exports  = router;