const express = require("express");
const morgon = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDb = require("./db.js");
const path = require("path");

// dotenv Config
dotenv.config();
// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(morgon());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Routes are Working" });
});

// user routes
app.use("/api/vi/user", require("./routes/userRoutes.js"));
app.use("/api/vi/admin", require("./routes/adminRoutews.js"));
app.use("/api/vi/doctor", require("./routes/doctorRoutes.js"));
// Static file
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} on port ${process.env.PORT}`
      .bgCyan.white
  );
});

// connecting DB
connectToDb();
