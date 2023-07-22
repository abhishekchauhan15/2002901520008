const express = require("express");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");
const Router = require("./routes/Router.js");
dotenv.config();
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
