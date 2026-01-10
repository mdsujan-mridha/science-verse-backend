const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// course routes 
const courseRoutes = require("./routes/courseRoutes");
// lessons routes 
const lessonsRoutes = require("./routes/lessonsRoutes");

// payment routes 
const paymentRoutes = require("./routes/paymentRoutes");
// chapter routes
const chapterRoutes = require("./routes/chapterRoutes");

// progress routes
const progressRoutes = require("./routes/progressRoutes");

app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Science Verse API is running");
});

module.exports = app;
