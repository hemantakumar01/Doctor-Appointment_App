const express = require("express");
const authMIddleware = require("../middleware/authMIddleware");
const {
  getSingleDoctor,
  updateDoctor,
  fetchAppointment,
  updateAppointment,
} = require("../controllers/doctorController");

const router = express.Router();
//POST To get Doctor Detail
router.post("/getSingleDoctor", authMIddleware, getSingleDoctor);
//POST To Update Doctor Detail
router.post("/updateDoctor", authMIddleware, updateDoctor);
//GET Fetch Appointmentys
router.get("/doctor-appointments", authMIddleware, fetchAppointment);
// POST to update appointment
router.post("/update-appointments", authMIddleware, updateAppointment);

module.exports = router;
