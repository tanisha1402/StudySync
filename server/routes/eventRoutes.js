const express = require("express");

const router = express.Router();


const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require(
  "../controllers/eventController"
);


const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);


// Add Event
router.post(
  "/",
  protect,
  createEvent
);


// View Events
router.get(
  "/",
  protect,
  getEvents
);


// Update Event
router.put(
  "/:id",
  protect,
  updateEvent
);


// Delete Event
router.delete(
  "/:id",
  protect,
  deleteEvent
);


module.exports = router;