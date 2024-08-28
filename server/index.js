const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});
