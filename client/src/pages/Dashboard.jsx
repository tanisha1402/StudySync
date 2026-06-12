import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import logo from "../assets/studysync-logo.png";

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    recentTasks: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">

        <div>

          <div className="logo-section">
            <img
              src={logo}
              alt="StudySync"
              className="sidebar-logo"
            />

            <h2>StudySync</h2>
          </div>

          <ul className="menu">
            <li className="active">Dashboard</li>
            <li>My Tasks</li>
            <li>Calendar</li>
            <li>Notes</li>
            <li>Project</li>
            <li>Settings</li>
          </ul>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="main-content">

        <h1>
          Welcome Back, {user?.name}
        </h1>

        

        {/* Project Overview */}
        <div className="project-card">

  <h2>StudySync</h2>

  <p>
    Manage your study tasks, notes and project
    progress efficiently in one place.
  </p>

  <div className="project-info">

    <div>
      <h4>User</h4>
      <span>{user?.name}</span>
    </div>

    <div>
      <h4>Total Tasks</h4>
      <span>{stats.totalTasks}</span>
    </div>

    <div>
    <h4>Pending</h4>
    <span>{stats.pendingTasks}</span>
    </div>

    <div>
      <h4>Progress</h4>
      <span>{stats.completionRate}%</span>
    </div>

  </div>

</div>
        {/* Tabs */}
        <div className="board-tabs">
          <span className="active-tab">Task Board</span>
          <span>Timeline</span>
          <span>Files</span>
        </div>

        {/* Kanban Board */}
        <div className="board-columns">

          <div className="board-column">
            <h3>To Do ({stats.pendingTasks})</h3>

            {stats.recentTasks
              ?.filter((task) => !task.completed)
              .map((task) => (
                <div
                  key={task._id}
                  className="task-card"
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              ))}
          </div>

          <div className="board-column">
            <h3>
              Completed ({stats.completedTasks})
            </h3>

            {stats.recentTasks
              ?.filter((task) => task.completed)
              .map((task) => (
                <div
                  key={task._id}
                  className="task-card"
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              ))}
          </div>

          <div className="board-column">
            <h3>Review</h3>

            <div className="task-card">
              <h4>No Tasks</h4>
              <p>Add review tasks later</p>
            </div>
          </div>

          <div className="board-column">
            <h3>Archive</h3>

            <div className="task-card">
              <h4>No Files</h4>
              <p>Archived tasks appear here</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
