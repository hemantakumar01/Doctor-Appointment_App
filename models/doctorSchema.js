const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First Name name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    userId: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    feePerCunsaltation: {
      type: String,
      required: [true, "Cunsaltation fee is required"],
    },
    timings: {
      type: Object,
      required: [true, "Timings  is required"],
    },
  },
  { timestamps: true }
);

const doctorModle = mongoose.model("doctors", doctorSchema);
module.exports = doctorModle;
