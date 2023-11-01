const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctor,
  getAllNotificatons,
  deleteAllNotificatons,
  getAllDoctor,
  bookAppointment,
  checkAvailability,
  allApointments,
} = require("../controllers/loginController");
const authMIddleware = require("../middleware/authMIddleware");

// router
const router = express.Router();

// routes

// Login || post
router.post("/login", loginController);
// Register User || POST
router.post("/register", registerController);
// Auth || POST
router.post("/getUserData", authMIddleware, authController);
// Apply for Doctor
router.post("/apply-doctor", authMIddleware, applyDoctor);
// Get all Notifications
router.post("/get-all-notification", authMIddleware, getAllNotificatons);
// Delete all notification
router.post("/delete-all-notification", authMIddleware, deleteAllNotificatons);
// GET All doctors
router.get("/getAllDoctor", authMIddleware, getAllDoctor);
// Book- Appointments
router.post("/book-appointment", authMIddleware, bookAppointment);
// Checking Availabilty
router.post("/check-avilability", authMIddleware, checkAvailability);
// Get all Appointments
router.get("/appointments", authMIddleware, allApointments);
module.exports = router;
