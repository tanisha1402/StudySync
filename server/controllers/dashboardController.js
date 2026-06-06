const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total Tasks
    const totalTasks = await Task.countDocuments({
      user: req.user._id,
    });

    // Completed Tasks
    const completedTasks = await Task.countDocuments({
      user: req.user._id,
      completed: true,
    });

    // Pending Tasks
    const pendingTasks = await Task.countDocuments({
      user: req.user._id,
      completed: false,
    });

    // Recent Tasks
    const recentTasks = await Task.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Completion Percentage
    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      recentTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};