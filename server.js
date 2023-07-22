import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;


app.get("/api/v1", (req, res) => {
  res.json("Welcome!");
});

const start = async () => {
  try {

    app.listen(port, () =>
      console.log(`Server is listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
