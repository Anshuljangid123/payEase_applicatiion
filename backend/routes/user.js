const express = require("express");
//    api/v1/user  -> this file route.
const zod = require('zod');
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

//You're validating the request body (req.body) using the Zod schema (signupSchema) you defined earlier.
const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string() , 
    firstName : zod.string(),
    lastname : zod.string()
})

// Define a proper handler for the route
router.post("/signup", async (req, res) => {
    // Your signup logic here (e.g., save user to DB)
    const body = req.body;
    
    // safeParse(data) is a Zod method that tries to validate data (in this case, req.body) against the schema.
    /**
     {
        success: true,   // if validation passed
        data: validatedData // only if success is true
    }
     */
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message  : "email already taken / incorrect inputs"
        })
    }
    const user = User.findOne({
        username : body.username // this func returns a document or null for success or failure.
    })
    if(user && user._id){
        return res.json({
            message : "email already taken / incorrect credentials "
        })
    }
    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId : dbUser._id 
    } , JWT_SECRET);

    res.json({
        message : "user created successfully ",
        token : token
    })
});

const signinSchema = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

router.post("/signin" , authMiddleware , async(req, res) => {
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        // i.e. data is valid 
        return res.json({
            message : "email already exist / or data is invalid "
        })
    }
    //findOne() (with await) returns null if no matching user is found.
    const user = await User.findOne({
        username : req.body.username , 
        password : req.body.password
    })

    if(user){
        //“If a user with the given username and password exists…”
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
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
 

// Correct the export statement
module.exports = router;
