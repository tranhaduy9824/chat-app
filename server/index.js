const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log("MongoDB connection failed: ", err.message));
