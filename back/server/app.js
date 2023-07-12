const mongoose = require("mongoose");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require('cors');

require("dotenv").config();

mongoose
  .connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    http.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

  const UserRoutes = require("./routes/UserRoutes");
  app.use("/user", UserRoutes);
