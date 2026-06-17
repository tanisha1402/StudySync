const Task = require("../models/Task");


// Create Task
exports.createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      deadline,
      priority,
    } = req.body;


    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      user: req.user._id,
    });


    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Get All Tasks
exports.getTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      user: req.user._id,
    }).sort({
      deadline: 1,
    });


    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Update Task
exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }


    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    task.title =
      req.body.title || task.title;


    task.description =
      req.body.description ||
      task.description;


    if (req.body.deadline) {
      task.deadline = req.body.deadline;
    }


    if (req.body.priority) {
      task.priority = req.body.priority;
    }


    if (
      req.body.completed !== undefined
    ) {
      task.completed = req.body.completed;
    }


    const updatedTask =
      await task.save();


    res.status(200).json(
      updatedTask
    );

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Delete Task
exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }


    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    await task.deleteOne();


    res.status(200).json({
      message:
        "Task deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// Get Overdue Tasks
exports.getOverdueTasks = async (req, res) => {
  try {

    const today = new Date();

    const tasks = await Task.find({
      user: req.user._id,
      completed: false,
      deadline: {
        $lt: today
      }
    }).sort({
      deadline: 1
    });


    res.status(200).json(tasks);


  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// Get Upcoming Tasks
exports.getUpcomingTasks = async (req, res) => {

  try {

    const today = new Date();

    const nextWeek = new Date();

    nextWeek.setDate(
      today.getDate() + 7
    );


    const tasks = await Task.find({

      user: req.user._id,

      completed: false,

      deadline: {
        $gte: today,
        $lte: nextWeek
      }

    }).sort({
      deadline: 1
    });


    res.status(200).json(tasks);


  } catch(error) {

    res.status(500).json({
      message: "Server Error"
    });

  }
};