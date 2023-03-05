const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");

// 1) MIDLEWARES

app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from Middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan("dev"));

const port = 3000;

//top level code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestTime: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const createNewTours = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId }, req.body); //middleware
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
};

const getTourById = (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
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
};

const deleteTour = (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  if (id < tours.length) {
    return res.status(204).json({
      status: "success",
      data: null, //In the Delete method we dont send any data and the status code is 204 which show the data got deleted
    });
  }
};

const updateTour = (req, res) => {
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
};

// ------------------------------------------------------

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
// 3) Tours ROUTES

app.route("/api/v1/tours").get(getAllTours).post(createNewTours);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .delete(deleteTour)
  .patch(updateTour);

// 4) User Routes
app.route("/api/v1/users").get(getAllUsers).post(updateAllUsers);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser);

// 4) START THE SERVER
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
