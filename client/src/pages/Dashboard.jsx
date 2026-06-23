import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../assets/studysync-logo.png";
import { MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import {
  FaTasks, FaCalendarAlt, FaStickyNote,
  FaFolder, FaUser, FaClock, FaChartLine,
  FaClipboardList, FaRegCircle, FaCheckCircle,
  FaEye, FaArchive, FaExclamationTriangle, FaBell,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    recentTasks: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
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
            <img src={logo} alt="StudySync" className="sidebar-logo" />
            <span className="logo-text">StudySync</span>
          </div>

          <p className="menu-label">MAIN MENU</p>

          <ul className="menu">
            <li className="active" onClick={() => navigate("/dashboard")}>
              <MdDashboard className="icon" /> Dashboard
            </li>
            <li onClick={() => navigate("/tasks")}>
              <FaTasks className="icon" /> My Tasks
            </li>
            <li onClick={() => navigate("/calendar")}>
              <FaCalendarAlt className="icon" /> Calendar
            </li>
            <li onClick={() => navigate("/notes")}>
  <FaStickyNote className="icon" />
  Notes
</li>
            <li>
              <FaFolder className="icon" /> Projects
            </li>
            <li>
              <MdSettings className="icon" /> Settings
            </li>
          </ul>
        </div>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Student</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <MdLogout className="icon" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">

        {/* Project Card */}
        <div className="project-card">
          <div className="project-card-top">
            <div>
              <h2>StudySync</h2>
              <p>Manage your study tasks, notes and project progress efficiently in one place.</p>
            </div>
          </div>

          <div className="project-info">
            <div className="info-box">
              <FaUser className="info-icon" />
              <div>
                <p className="info-label">User</p>
                <p className="info-value">{user?.name}</p>
              </div>
            </div>
            <div className="info-box">
              <FaClipboardList className="info-icon" />
              <div>
                <p className="info-label">Total Tasks</p>
                <p className="info-value">{stats.totalTasks}</p>
              </div>
            </div>
            <div className="info-box">
              <FaClock className="info-icon" />
              <div>
                <p className="info-label">Pending</p>
                <p className="info-value">{stats.pendingTasks}</p>
              </div>
            </div>
            <div className="info-box">
              <FaChartLine className="info-icon" />
              <div>
                <p className="info-label">Progress</p>
                <p className="info-value">{stats.completionRate}%</p>
              </div>
            </div>
            <div className="info-box">
              <FaExclamationTriangle className="info-icon icon-overdue" />
              <div>
                <p className="info-label">Overdue</p>
                <p className="info-value">{stats.overdueTasks}</p>
              </div>
            </div>
            <div className="info-box">
              <FaBell className="info-icon icon-upcoming" />
              <div>
                <p className="info-label">Upcoming</p>
                <p className="info-value">{stats.upcomingTasks}</p>
              </div>
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
            <div className="column-header">
              <FaRegCircle className="col-icon" />
              <h3>To Do</h3>
              <span className="count">{stats.pendingTasks}</span>
            </div>
            {stats.recentTasks?.filter(t => !t.completed).length === 0 && (
              <div className="empty-col"><p>No tasks yet</p></div>
            )}
            {stats.recentTasks?.filter(t => !t.completed).map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ))}
          </div>

          <div className="board-column">
            <div className="column-header">
              <FaCheckCircle className="col-icon" />
              <h3>Completed</h3>
              <span className="count">{stats.completedTasks}</span>
            </div>
            {stats.recentTasks?.filter(t => t.completed).length === 0 && (
              <div className="empty-col"><p>Nothing completed yet</p></div>
            )}
            {stats.recentTasks?.filter(t => t.completed).map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ))}
          </div>

          <div className="board-column">
            <div className="column-header">
              <FaEye className="col-icon" />
              <h3>Review</h3>
            </div>
            <div className="empty-col"><p>Add review tasks later</p></div>
          </div>

          <div className="board-column">
            <div className="column-header">
              <FaArchive className="col-icon" />
              <h3>Archive</h3>
            </div>
            <div className="empty-col"><p>Archived tasks appear here</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;