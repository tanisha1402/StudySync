import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

const getToken = () => localStorage.getItem("token");

export const getEvents = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await axios.post(API_URL, eventData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const updateEvent = async (id, eventData) => {
  const res = await axios.put(`${API_URL}/${id}`, eventData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};