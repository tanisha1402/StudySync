const express = require("express");

const router = express.Router();

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");


const {
  protect,
} = require("../middlewares/authMiddleware");


// Create Note
router.post(
  "/",
  protect,
  createNote
);


// Get All Notes
router.get(
  "/",
  protect,
  getNotes
);


// Update Note
router.put(
  "/:id",
  protect,
  updateNote
);


// Delete Note
router.delete(
  "/:id",
  protect,
  deleteNote
);


module.exports = router;