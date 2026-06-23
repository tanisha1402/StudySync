import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

// Get token from localStorage
const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// Get all notes
export const getNotes = async () => {
  const response = await axios.get(
    API_URL,
    getConfig()
  );

  return response.data;
};


// Create note
export const createNote = async (noteData) => {
  const response = await axios.post(
    API_URL,
    noteData,
    getConfig()
  );

  return response.data;
};


// Update note
export const updateNote = async (
  id,
  noteData
) => {

  const response = await axios.put(
    `${API_URL}/${id}`,
    noteData,
    getConfig()
  );

  return response.data;
};


// Delete note
export const deleteNote = async (id) => {

  const response = await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );

  return response.data;
};