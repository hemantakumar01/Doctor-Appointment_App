const mongoose = require("mongoose");
const colors = require("colors");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log(`DB connected on ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Issue on Connecting Server ${error}`.bgRed.white);
  }
};

module.exports = connectToDb;
