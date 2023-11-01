const express = require("express");
const authMIddleware = require("../middleware/authMIddleware");
const {
  getAllDoctorController,
  getAllUserController,
  approveDoctor,
} = require("../controllers/adminController");

const router = express.Router();
// GET all users
router.get("/getAllUsers", authMIddleware, getAllUserController);
// GET all doctors
router.get("/getAllDoctors", authMIddleware, getAllDoctorController);
// Doctor Account Status
router.post("/approve-doctor", authMIddleware, approveDoctor);

module.exports = router;
