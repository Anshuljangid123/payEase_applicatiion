const express = require('express');
const cors = require('cors');

const rootRouter = require("./routes/index");

const app = express();

app.use(cors());// apply  cors for all the routes.
app.use(express.json());// for parsing data 

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log(`server is running on port 3000`);
});
