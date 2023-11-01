const mongoose = require("mongoose");

const appoinmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,

      default: "pending",
    },
    time: {
      type: String,
      required: true,
    },
    time2: {
      type: String,
    },
  },
  { timestamps: true }
);

const appointmentModle = mongoose.model("appointments", appoinmentSchema);
module.exports = appointmentModle;
