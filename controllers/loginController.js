const userModule = require("../models/userSchema");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctorModle = require("../models/doctorSchema");
const colors = require("colors");
const appointmentModle = require("../models/appoinmentSchema");
const moment = require("moment");
const registerController = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    let user = await userModule.findOne({ email });
    if (user)
      return res.status(200).send({ success: false, message: "User Exist" });
    const hashedPassword = await brcypt.hash(password, 10);
    user = await userModule.create({ email, password: hashedPassword, name });
    res.status(201).send({ message: "User Created", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Register Controller : ${error.message}`,
      success: false,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModule.findOne({ email });
    if (!user)
      return res
        .status(200)
        .send({ success: false, message: "User Don't exist" });
    const isPassMatch = await brcypt.compare(password, user.password);
    if (!isPassMatch)
      return res
        .status(400)
        .send({ success: false, message: "Invalid Email or Password" });

    const token = await jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    res.status(200).send({ success: true, message: "Logged In", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Error Occcored : ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModule.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    } else {
      user.password = undefined;
      res.status(200).send({
        success: true,
        data: {
          user,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some went worng",
    });
  }
};

// Apply Doctor Function
const applyDoctor = async (req, res) => {
  try {
    const alreadyApplied = await doctorModle.findOne({
      email: req.body.email,
    });
    if (alreadyApplied)
      return res.status(200).send({
        success: false,
        message: "You have already Applied",
        data: alreadyApplied,
      });
    const newDoctor = await doctorModle.create(req.body);
    const adminUser = await userModule.findOne({ isAdmin: true });

    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${
        newDoctor.firstName + " " + newDoctor.lastName
      } has applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModule.findByIdAndUpdate(adminUser._id, {
      notification: notification,
    });

    res.status(201).send({
      success: true,
      message: "Applied  for Doctor Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Apply Doctor Failed",
    });
  }
};

// GET all notification
const getAllNotificatons = async (req, res) => {
  try {
    const user = await userModule.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;

    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification mark as read",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Some went wrong",
      error: `Error is : ${error}`,
    });
  }
};
const deleteAllNotificatons = async (req, res) => {
  try {
    const user = await userModule.findById({ _id: req.body.userId });

    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All Appointments are Deleted",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Some thing went wrong", error: error });
  }
};
// To get All Doctors
const getAllDoctor = async (req, res) => {
  try {
    const doctor = await doctorModle.find({ status: "approved" });
    if (!doctor) {
      return res.status(200).send({
        success: false,
        message: "Sorry ,no Available Doctor",
      });
    }
    res.status(201).send({
      success: true,
      message: "Docter fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some thing went wrong on fetching Doctor",
      error: error,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const toTime = moment(req.body.time, "HH:mm").add(30, "m").toISOString();

    req.body.status = "pending";
    const newAppointmenr = await appointmentModle.create({
      ...req.body,
      time2: toTime,
    });
    const user = await userModule.findOne({ _id: req.body.doctorId });
    const notification = user.notification;
    notification.push({
      type: "new-appointment-request",
      message: `A new appointment from ${req.body.userInfo.name}`,
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appontment Booked successfully",
      time: moment(req.body.time).format("HH:mm"),
      date: req.body.date,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error on booking Appiontment",
      success: false,
    });
  }
};
const checkAvailability = async (req, res) => {
  try {
    const toTime = moment(req.body.time, "HH:mm").add(30, "m").toISOString();

    const appointments = await appointmentModle.find({
      doctorInfo: req.body.doctorId,
      time: req.body.time,
      date: req.body.date,
      time2: { $gte: req.body.time, $lte: toTime },
    });
    console.log(colors.yellow(appointments));
    console.log(colors.yellow(req.body.doctorId));
    if (appointments.length > 0) {
      res.status(200).send({
        message: "Not Available",
        success: false,
        toTime: moment(toTime).format("HH:mm"),
        fromTime: req.body.time,
        doctorId: req.body.doctorId,
        date: req.body.date,
        time: req.body.time,
        appointments,
      });
    } else {
      res.status(200).send({
        message: "Available",
        success: true,
        toTime: moment(toTime).format("HH:mm"),
        fromTime: req.body.time,
        time: moment(req.body.time).format("HH:mm"),
        doctorId: req.body.doctorId,
        date: req.body.date,
        time: req.body.time,
        appointments,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Checking Availability",
      success: false,
      data: error,
    });
  }
};

const allApointments = async (req, res) => {
  try {
    console.log(req.body.userId);
    const appointments = await appointmentModle.find({
      userId: req.body.userId,
    });
    if (!appointments) {
      return res.status(200).send({
        message: "No Appointments Yet",
        success: false,
      });
    }

    res.status(200).send({
      message: "Fetched All Appointments",
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      message: "Error in fetching Appointments",
      success: false,
    });
  }
};
module.exports = {
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
};
