const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

// Load env variables
dotenv.config({ path: "./.env" });

// Connect to MongoDB
require("./db/conn");

app.use(express.json());

// Define Routes
app.use(require("./router/auth"));

const port = process.env.PORT || 5000;  

app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
});
