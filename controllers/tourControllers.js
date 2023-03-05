const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestTime: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

exports.createNewTours = (req, res) => {
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

exports.getTourById = (req, res) => {
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

exports.deleteTour = (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  if (id < tours.length) {
    return res.status(204).json({
      status: "success",
      data: null, //In the Delete method we dont send any data and the status code is 204 which show the data got deleted
    });
  }
};

exports.updateTour = (req, res) => {
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
