const express = require("express");
const { checkId } = require("../controllers/tourControllers");

const {
  getAllTours,
  createNewTours,
  getTourById,
  deleteTour,
  updateTour,
} = require(`./../controllers/tourControllers`);

const router = express.Router();
router.param("id", checkId);
// 3) Tours ROUTES
router.route("/").get(getAllTours).post(createNewTours);
router.route("/:id").get(getTourById).delete(deleteTour).patch(updateTour);

module.exports = router;
