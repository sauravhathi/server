const mongoose = require("mongoose");

const DB = process.env.db;

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
