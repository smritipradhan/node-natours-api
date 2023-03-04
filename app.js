const express = require("express");
const fs = require("fs");
const app = express();

const port = 3000;

//top level code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//the callback function will be called when the server starts listening.
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
