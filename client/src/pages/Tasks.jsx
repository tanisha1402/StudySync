import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tasks.css";
import logo from "../assets/studysync-logo.png";
import { MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import {
  FaTasks, FaCalendarAlt, FaStickyNote,
  FaFolder, FaPlus, FaEdit, FaTrash,
  FaCheck, FaExclamationTriangle,
} from "react-icons/fa";
import {
  getTasks, createTask, updateTask, deleteTask,
} from "../services/taskService";

function Tasks() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "Medium",
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deadline = formData.time
        ? `${formData.date}T${formData.time}:00`
        : `${formData.date}T00:00:00`;

      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: deadline,
        priority: formData.priority,
      };

      if (editTask) {
        await updateTask(editTask._id, payload);
      } else {
        await createTask(payload);
      }

      setFormData({ title: "", description: "", date: "", time: "", priority: "Medium" });
      setShowForm(false);
      setEditTask(null);
      loadTasks();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    const d = new Date(task.deadline);
    const dateStr = d.toISOString().split("T")[0];
    const timeStr = d.toTimeString().slice(0, 5);
    setFormData({
      title: task.title,
      description: task.description,
      date: dateStr,
      time: timeStr,
      priority: task.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id);
      loadTasks();
    }
  };

  const handleComplete = async (task) => {
    await updateTask(task._id, { completed: !task.completed });
    loadTasks();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const today = new Date();

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "overdue") return !task.completed && task.deadline && new Date(task.deadline) < today;
    return true;
  });

  const isOverdue = (task) =>
    !task.completed && task.deadline && new Date(task.deadline) < today;

  const priorityColor = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div>
          <div className="logo-section">
            <img src={logo} alt="StudySync" className="sidebar-logo" />
            <span className="logo-text">StudySync</span>
          </div>
          <p className="menu-label">MAIN MENU</p>
          <ul className="menu">
            <li onClick={() => navigate("/dashboard")}>
              <MdDashboard className="icon" /> Dashboard
            </li>
            <li className="active" onClick={() => navigate("/tasks")}>
              <FaTasks className="icon" /> My Tasks
            </li>
            <li onClick={() => navigate("/calendar")}>
              <FaCalendarAlt className="icon" /> Calendar
            </li>
            <li><FaStickyNote className="icon" /> Notes</li>
            <li><FaFolder className="icon" /> Projects</li>
            <li><MdSettings className="icon" /> Settings</li>
          </ul>
        </div>
        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Student</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <MdLogout className="icon" /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="page-header">
          <div className="page-title">
            <h1>My Tasks</h1>
            <p>Manage and track your tasks</p>
          </div>
          <button className="add-btn" onClick={() => {
            setShowForm(true);
            setEditTask(null);
            setFormData({ title: "", description: "", date: "", time: "", priority: "Medium" });
          }}>
            <FaPlus /> Add Task
          </button>
        </div>

        {showForm && (
          <div className="task-form-card">
            <h3>{editTask ? "Edit Task" : "Add New Task"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Task description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deadline Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deadline Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-btns">
                <button type="submit" className="save-btn">
                  {editTask ? "Update" : "Save"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowForm(false);
                  setEditTask(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-tabs">
          {["all", "pending", "completed", "overdue"].map(f => (
            <span
              key={f}
              className={filter === f ? "active-filter" : ""}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </span>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 && (
            <div className="no-tasks">No tasks found</div>
          )}
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className={`task-item ${task.completed ? "task-done" : ""} ${isOverdue(task) ? "task-overdue" : ""}`}
            >
              <div className="task-left">
                <button
                  className={`complete-btn ${task.completed ? "completed" : ""}`}
                  onClick={() => handleComplete(task)}
                >
                  {task.completed && <FaCheck />}
                </button>
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority-badge ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.deadline && (
                      <span className="deadline">
                        {formatDateTime(task.deadline)}
                      </span>
                    )}
                    {isOverdue(task) && (
                      <span className="overdue-badge">
                        <FaExclamationTriangle /> Overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEdit(task)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;