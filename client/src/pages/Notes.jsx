import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Notes.css";
import logo from "../assets/studysync-logo.png";

import {
  MdDashboard,
  MdSettings,
  MdLogout
} from "react-icons/md";

import {
  FaTasks,
  FaCalendarAlt,
  FaStickyNote,
  FaFolder,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from "../services/noteService";


function Notes() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  // States
  const [notes, setNotes] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editNote, setEditNote] =
    useState(null);


  const [formData, setFormData] =
    useState({
      title: "",
      content: "",
    });


  // Load Notes
  
  const loadNotes = useCallback(async () => {
  try {
    const data = await getNotes();

    if (Array.isArray(data)) {
      setNotes(data);
    } else {
      setNotes([]);
    }
  } catch (error) {
    console.log("Error loading notes:", error);
    setNotes([]);
  }
}, []);
      


  // Run when page loads
  useEffect(() => {
  const fetchNotes = async () => {
    await loadNotes();
  };

  fetchNotes();
}, [loadNotes]);
  // Add or Update Note
  const handleSubmit = async (e) => {

    e.preventDefault();


    try {


      if(editNote) {


        await updateNote(
          editNote._id,
          formData
        );


      }

      else {


        await createNote(
          formData
        );


      }


      // Reset Form
      setFormData({
        title: "",
        content: "",
      });


      setShowForm(false);

      setEditNote(null);


      loadNotes();


    }

    catch(error) {


      console.log(error);


    }

  };



  // Edit Note
  const handleEdit = (note) => {


    setEditNote(note);


    setFormData({

      title: note.title,

      content: note.content,

    });


    setShowForm(true);


  };



  // Delete Note
  const handleDelete = async (id) => {


    const confirmDelete =
      window.confirm(
        "Delete this note?"
      );


    if(!confirmDelete)
      return;


    try {


      await deleteNote(id);


      loadNotes();


    }

    catch(error) {


      console.log(error);


    }


  };



  // Logout
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

            <span className="logo-text">
              StudySync
            </span>

          </div>


          <p className="menu-label">
            MAIN MENU
          </p>


          <ul className="menu">

            <li
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <MdDashboard className="icon"/>
              Dashboard
            </li>


            <li
              onClick={() =>
                navigate("/tasks")
              }
            >
              <FaTasks className="icon"/>
              My Tasks
            </li>


            <li
              onClick={() =>
                navigate("/calendar")
              }
            >
              <FaCalendarAlt className="icon"/>
              Calendar
            </li>


            <li className="active">

              <FaStickyNote className="icon"/>

              Notes

            </li>


            <li>

              <FaFolder className="icon"/>

              Projects

            </li>


            <li>

              <MdSettings className="icon"/>

              Settings

            </li>

          </ul>

        </div>


        {/* User Info */}
        <div className="sidebar-bottom">

          <div className="user-info">

            <div className="user-avatar">

              {user?.name?.charAt(0).toUpperCase()}

            </div>


            <div className="user-details">

              <p className="user-name">
                {user?.name}
              </p>


              <p className="user-role">
                Student
              </p>

            </div>

          </div>


          <button
            className="logout-btn"
            onClick={logout}
          >

            <MdLogout className="icon" />

            Logout

          </button>


        </div>


      </div>


      {/* Main Content */}
      <div className="main-content">


        {/* Header */}
        <div className="page-header">


          <div className="page-title">

            <h1>
              Notes
            </h1>


            <p>
              Create and manage your personal notes
            </p>


          </div>


          <button

            className="add-btn"

            onClick={() => {

              setShowForm(true);

              setEditNote(null);

              setFormData({
                title: "",
                content: "",
              });

            }}

          >

            <FaPlus />

            Add Note

          </button>


        </div>


        {/* Add / Edit Form */}
        {showForm && (

          <div className="note-form-card">


            <h3>

              {editNote
                ? "Edit Note"
                : "Create New Note"}

            </h3>


            <form onSubmit={handleSubmit}>
                              <div className="form-group">

                <label>
                  Title
                </label>


                <input
                  type="text"
                  placeholder="Enter note title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Content
                </label>


                <textarea
                  placeholder="Write your note here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    })
                  }
                  rows="6"
                />

              </div>


              <div className="form-buttons">


                <button
                  type="submit"
                  className="save-btn"
                >

                  {editNote
                    ? "Update Note"
                    : "Save Note"}

                </button>


                <button
                  type="button"
                  className="cancel-btn"

                  onClick={() => {

                    setShowForm(false);

                    setEditNote(null);

                  }}

                >

                  Cancel

                </button>


              </div>


            </form>


          </div>

        )}



        {/* Notes List */}
        <div className="notes-container">


          <h2>
            My Notes
          </h2>


          {notes.length === 0 && (

            <div className="no-notes">

              No notes available

            </div>

          )}



          <div className="notes-grid">


            {notes.map((note) => (

              <div
                key={note._id}
                className="note-card"
              >


                <div className="note-content">

                  <h3>
                    {note.title}
                  </h3>


                  <p>
                    {note.content}
                  </p>

<p className="note-date">
  {new Date(note.createdAt).toLocaleString()}
</p>
                </div>


                <div className="note-actions">


                  <button
                    className="edit-btn"

                    onClick={() =>
                      handleEdit(note)
                    }

                  >

                    <FaEdit />

                  </button>



                  <button
                    className="delete-btn"

                    onClick={() =>
                      handleDelete(note._id)
                    }

                  >

                    <FaTrash />

                  </button>


                </div>


              </div>

            ))}


          </div>


        </div>


      </div>


    </div>


  );

}


export default Notes;