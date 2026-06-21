import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getToken = () => localStorage.getItem("token");

export const getTasks = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axios.post(API_URL, taskData, {
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await axios.put(`${API_URL}/${id}`, taskData, {
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};