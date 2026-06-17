const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getOverdueTasks,
  getUpcomingTasks,
} = require("../controllers/taskController");
const {
  protect,
} = require("../middlewares/authMiddleware");

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

// Get overdue tasks
router.get(
  "/overdue",
  protect,
  getOverdueTasks
);


// Get upcoming tasks
router.get(
  "/upcoming",
  protect,
  getUpcomingTasks
);

module.exports = router;

