// backend/api/index.js
//  /api/v1 -> this file route address

const express = require('express'); // Importing the Express framework to use its routing functionality.
const userRouter = require("./user.js");

const router = express.Router(); // Creating a new router instance from Express. This router can be used to define grouped routes (modular route handling).

router.use("/user" , userRouter);
//This line is used to mount a sub-router (userRouter) on a specific path (/user) using Express's routing system.

module.exports = router; // Exporting the router instance so it can be imported and used in other parts of the application (e.g., in the main server file).

