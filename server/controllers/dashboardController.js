const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {
  try {

    // Get all tasks of logged-in user
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });


    // Total Tasks
    const totalTasks = tasks.length;


    // Completed Tasks
    const completedTasks = tasks.filter(
      task => task.completed
    ).length;


    // Pending Tasks
    const pendingTasks = tasks.filter(
      task => !task.completed
    ).length;


    // Completion Percentage
    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );


    // Current Date
    const today = new Date();


    // Overdue Tasks
    const overdueTasks = tasks.filter(
      task =>
        !task.completed &&
        task.deadline &&
        new Date(task.deadline) < today
    ).length;


    // Upcoming Tasks (Next 7 Days)
    const nextWeek = new Date();

    nextWeek.setDate(
      today.getDate() + 7
    );


    const upcomingTasks = tasks.filter(
      task =>
        !task.completed &&
        task.deadline &&
        new Date(task.deadline) >= today &&
        new Date(task.deadline) <= nextWeek
    ).length;


    // Latest 5 Tasks
    const recentTasks = tasks.slice(0, 5);


    // Send dashboard data
    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,

      // New Deadline Statistics
      overdueTasks,
      upcomingTasks,

      recentTasks,
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};