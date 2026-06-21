import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Calendar.css";
import logo from "../assets/studysync-logo.png";
import { MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import {
  FaTasks, FaCalendarAlt, FaStickyNote,
  FaFolder, FaPlus, FaEdit, FaTrash, FaTimes,
} from "react-icons/fa";
import {
  getEvents, createEvent, updateEvent, deleteEvent,
} from "../services/eventService";

function Calendar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateValue = formData.time
        ? `${formData.date}T${formData.time}:00`
        : `${formData.date}T00:00:00`;

      const payload = {
        title: formData.title,
        description: formData.description,
        date: dateValue,
      };

      if (editEvent) {
        await updateEvent(editEvent._id, payload);
      } else {
        await createEvent(payload);
      }

      setFormData({ title: "", description: "", date: "", time: "" });
      setShowForm(false);
      setEditEvent(null);
      loadEvents();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    const d = new Date(event.date);
    const dateStr = d.toISOString().split("T")[0];
    const timeStr = d.toTimeString().slice(0, 5);
    setFormData({
      title: event.title,
      description: event.description,
      date: dateStr,
      time: timeStr,
    });
    setShowForm(true);
    setSelectedDay(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await deleteEvent(id);
      await loadEvents();
      setSelectedDay(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // timezone fix — local date compare
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventDay = eventDate.getDate();
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      
      console.log(`Event: ${event.title}, Day: ${eventDay}, Month: ${eventMonth}, Year: ${eventYear}`);
      console.log(`Comparing with: Day: ${day}, Month: ${month}, Year: ${year}`);
      
      return eventDay === day && eventMonth === month && eventYear === year;
    });
  };
  const handleDayClick = (day, dayEvents) => {
    if (dayEvents.length === 0) return;
    setSelectedDay(day);
    setSelectedDayEvents(dayEvents);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
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
            <li onClick={() => navigate("/tasks")}>
              <FaTasks className="icon" /> My Tasks
            </li>
            <li className="active" onClick={() => navigate("/calendar")}>
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
            <h1>Calendar</h1>
            <p>Manage your events and schedule</p>
          </div>
          <button className="add-btn" onClick={() => {
            setShowForm(true);
            setEditEvent(null);
            setSelectedDay(null);
            setFormData({ title: "", description: "", date: "", time: "" });
          }}>
            <FaPlus /> Add Event
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="task-form-card">
            <h3>{editEvent ? "Edit Event" : "Add New Event"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Event title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Event description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-btns">
                <button type="submit" className="save-btn">
                  {editEvent ? "Update" : "Save"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowForm(false);
                  setEditEvent(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Day Popup */}
        {selectedDay && (
          <div className="day-popup">
            <div className="day-popup-header">
              <h3>{monthNames[month]} {selectedDay}, {year}</h3>
              <button className="popup-close" onClick={() => setSelectedDay(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="day-popup-events">
              {selectedDayEvents.map(ev => (
                <div key={ev._id} className="popup-event-item">
                  <div>
                    <h4>{ev.title}</h4>
                    <p>{ev.description}</p>
                    <span className="event-date">
                      {formatDateTime(ev.date)}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => handleEdit(ev)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(ev._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="calendar-card">
          <div className="cal-header">
            <button onClick={prevMonth}>←</button>
            <h2>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth}>→</button>
          </div>

          <div className="cal-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="cal-day-name">{d}</div>
            ))}
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="cal-day empty"></div>
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`cal-day ${isToday ? "today" : ""} ${dayEvents.length > 0 ? "has-events" : ""}`}
                  onClick={() => handleDayClick(day, dayEvents)}
                >
                  <span className="day-num">{day}</span>
                  <div className="day-events">
  {dayEvents.length > 0 && (
    <div className="cal-event">
      {dayEvents[0].title}
    </div>
  )}

  {dayEvents.length > 1 && (
    <div className="more-events">
      +{dayEvents.length - 1} more
    </div>
  )}
</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="event-list">
          <h2>All Events</h2>
          {events.length === 0 && (
            <div className="no-tasks">No events yet</div>
          )}
          {events.map(event => (
            <div key={event._id} className="event-item">
              <div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <span className="event-date">
                  {formatDateTime(event.date)}
                </span>
              </div>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEdit(event)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>
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

export default Calendar;