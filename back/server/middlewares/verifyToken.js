const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  const cancelToken = req.headers["authorization"]?.split(" ")[2];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(401)
          .send({ auth: false, message: "Failed to authenticate token" });
      req.user = {};
      req.user.id = decoded.userId;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res
      .status(401)
      .send({ auth: false, message: "No token provided", isLoggedIn: false });
  }
}

module.exports = {
  verifyToken
};
