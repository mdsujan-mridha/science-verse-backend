const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



// course routes 
const courseRoutes = require("./routes/courseRoutes");
// lessons routes 
const lessonsRoutes = require("./routes/lessonsRoutes");

// payment routes 
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Science Verse API is running");
});

module.exports = app;
