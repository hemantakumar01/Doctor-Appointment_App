const jwt = require("jsonwebtoken");
const colors = require("colors");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN, (error, decode) => {
      if (error) {
        return res.status(200).send({
          success: false,
          message: "Auth Failed",
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ messsage: "Autharisation failed", success: false, error });
  }
};
