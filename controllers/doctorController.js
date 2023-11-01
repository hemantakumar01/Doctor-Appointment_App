const doctorModle = require("../models/doctorSchema.js");
const userModle = require("../models/userSchema.js");
const appointmentModle = require("../models/appoinmentSchema.js");
const color = require("colors");
const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await doctorModle.findOne({ userId: req.body.userId });
    if (!doctor)
      return res.status(200).send({
        success: true,
        message: "Doctor Not found",
      });

    res.status(201).send({
      success: true,
      message: `I am ${doctor.firstName + " " + doctor.firstName}`,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erron on  Geting  Doctor",
    });
  }
};
const updateDoctor = async (req, res) => {
  try {
    const doctor = await doctorModle.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Somthig went worng in Updating Doctor",
      success: false,
    });
  }
};
const fetchAppointment = async (req, res) => {
  try {
    const user = await userModle.findById({ _id: req.body.userId });
    const appointments = await appointmentModle.find({ doctorId: user._id });

    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in fetching Doctor appointment",
      success: false,
    });
  }
};

const updateAppointment = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    const updatedAppointment = await appointmentModle.findByIdAndUpdate(
      { _id: appointmentId },
      { status: status }
    );
    res.status(200).send({
      success: true,
      message: "Updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in updateing Appointment",
    });
  }
};
const changeFuntionName = async (req, res) => {};
module.exports = {
  getSingleDoctor,
  updateDoctor,
  fetchAppointment,
  updateAppointment,
};
