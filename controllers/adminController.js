const userModule = require("../models/userSchema");
const doctorsModule = require("../models/doctorSchema");
const colors = require("colors");

// GET all users
const getAllUserController = async (req, res) => {
  try {
    const users = await userModule.find({});
    if (!users) {
      return res.status(200).send({
        success: true,
        message: "User not found",
        data: users,
      });
    }
    res.status(200).send({
      success: true,
      message: "User list Data",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Occoured",
      error,
    });
  }
};
// GET all doctors
const getAllDoctorController = async (req, res) => {
  try {
    const doctor = await doctorsModule.find({});
    if (!doctor) {
      return res.status(200).send({
        success: true,
        message: "User not found",
        data: doctor,
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor list Data",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Occoured",
      error: error,
    });
  }
};
// To Approve Doctor
const approveDoctor = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorsModule.findByIdAndUpdate(doctorId, { status });
    const user = await userModule.findOne({ _id: doctor.userId });

    user.isDoctor = true;
    await user.save();

    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request has ${status}`,
      onClickPath: "/notification",
    });

    const newUser = await user.save();
    res.status(200).send({
      success: true,
      message: doctor.status,
      data: doctor,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some Went wrong on Account Approve",
    });
  }
};

module.exports = {
  getAllDoctorController,
  getAllUserController,
  approveDoctor,
};
