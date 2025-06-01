const express = require("express");
//    api/v1/user  -> this file route.
const zod = require('zod');
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config").default;
const { authMiddleware } = require("../middleware");

const router = express.Router();

//You're validating the request body (req.body) using the Zod schema (signupSchema) you defined earlier.
const signupSchema = zod.object({
    firstName : zod.string(),
    lastName : zod.string(),
    email : zod.string(),
    password : zod.string() , 
})
// username 
// Define a proper handler for the route
router.post("/signup", async (req, res) => {
    console.log("inside signup route post request ")
    // Your signup logic here (e.g., save user to DB)
    const body = req.body;
    console.log(body);
    // safeParse(data) is a Zod method that tries to validate data (in this case, req.body) against the schema.
    /**
     {
        success: true,   // if validation passed
        data: validatedData // only if success is true
    }
     */

    console.log("Creating user with:", body);

    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message  : "email already taken / incorrect inputs"
        })
    }
    const user = await User.findOne({
        email : body.email // this func returns a document or null for success or failure.
    })
    if(user && user._id){
        return res.status(411).json({
            message : "email already taken / incorrect credentials "
        })
    }
    const dbUser = await User.create(body);

    const userId = dbUser._id;

    // -------- create  a new Account -------------
    await Account.create({
        userId, 
        balance : 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    } , JWT_SECRET);

    res.json({
        message : "user created successfully ",
        token : token
    })
});

const signinSchema = zod.object({
    email : zod.string().email(),
    password : zod.string()
})
 
router.post("/signin" , async(req, res) => {
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        // i.e. data is valid 
        return res.json({
            message : "email already exist / or data is invalid "
        })
    }
    //findOne() (with await) returns null if no matching user is found.
    const user = await User.findOne({
        email : req.body.email , 
        password : req.body.password
    })

    if(user){
        //“If a user with the given email and password exists…”
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET)

        res.json({
            message : "login successfull and the user will receive the jwt token " , 
            token: token
        })

        return 
    }
    res.status(411).json({
        message : "error while loggin in the user "
    })
})

// router to fetch all the users form the Users table in db using the search bar 

router.get("/fetchUsers" , async(req, res) => {
    const search = req.query.search || "" ;
    const users = await User.find({
        firstName : {$regex : search , $options : "i"} // case insensitive match 
    }).select("firstName lastName")
    res.json(users)
})
//Whatever they send, we need to update it in the database for the user.
//Use the middleware we defined in the last section to authenticate the user

const updateBodySchema = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastname : zod.string().optional()
})

router.put("/" , authMiddleware , async (req, res) => {
    const {success} = updateBodySchema.safeParse(req.body); // data from the body should folow the specific schema (updateBodySchema)

    if(!success){
        res.status(411).json({
            message : "error while updating the users information "
        })
    }

    await User.updateOne({_id : req.userId } , req.body)

    res.json({
        message : " user info updated successfully ." 
    })

})

//2. Route to get users from the backend, filterable via firstName/lastName
//This is needed so users can search for their friends and send them money
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
 


// Correct the export statement
module.exports = router;
