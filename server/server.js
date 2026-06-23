const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);
const eventRoutes = require(
  "./routes/eventRoutes"
);
const noteRoutes = require(
  "./routes/noteRoutes"
);


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StudySync API is running...");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);


app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/notes",
  noteRoutes
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




