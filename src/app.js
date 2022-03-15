const express = require("express");
const { Server } = require("socket.io");

const ProductManagerDB = require("./Manager/ProductManagerDB.js");

//services
const productService = new ProductManagerDB();
const app = express();
const server = app.listen(8080, () => console.log("Listening on 8080"));
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", async (socket) => {
  console.log("a user connected");
  let products = await productService.getAll();
  io.emit("productLog", products);
  socket.on("sendProduct", async (data) => {
    await productService.add(data);
    let products = await productService.getAll();
    io.emit("productLog", products);
  });
});

let log = [];

io.on("connection", (socket) => {
  socket.emit("log", log);
  socket.on("message", (dataChat) => {
    log.push(dataChat);
    io.emit("log", log);
  });
});
