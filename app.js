const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const port = 3000;

//top level code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//------------------------------HANDLING GET REQUEST for all tours------------------------------
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//-------------------------HANDLING POST request ------------------------------
app.post("/api/v1/tours", (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  console.log(newTourId);
  const newTour = Object.assign({ id: newTourId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).send({
        status: "sucess",
        tours: newTour,
      });
    }
  );
});

//HANDLING GET Requests for one tour based on the id
app.get("/api/v1/tours/:id", (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  console.log(id);
  const tour = tours.find((element) => element.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "failure",
      message: "Invalid id Found !!",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

//HANDLING PATCH Requests for one tour based on the id
app.patch("/api/v1/tours/:id", (req, res) => {
  //dummy code which wont change the JSON data as the JSON data is static. Will work with the Database in future
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick

  if (id < tours.length) {
    return res.status(200).json({
      status: "success",
      data: {
        tour: `<Here will be the Updated Tour Data>`,
      },
    });
  }
});

//HANDLING DELETE Requests for one tour based on the id
app.delete("/api/v1/tours/:id", (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  if (id < tours.length) {
    return res.status(204).json({
      status: "success",
      data: null, //In the Delete method we dont send any data and the status code is 204 which show the data got deleted
    });
  }
});

//the callback function will be called when the server starts listening.
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
