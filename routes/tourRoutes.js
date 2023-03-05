const express = require("express");

const {
  getAllTours,
  createNewTours,
  getTourById,
  deleteTour,
  updateTour,
} = require(`./../controllers/tourControllers`);

const tourRouter = express.Router();

// 3) Tours ROUTES
tourRouter.route("/").get(getAllTours).post(createNewTours);
tourRouter.route("/:id").get(getTourById).delete(deleteTour).patch(updateTour);

module.exports = tourRouter;
