const express = require("express");
const fs = require("fs");
const path = require("path");
const fileReaderAsync = require("./fileReader");
const fileWriterAsync = require("./fileWriter");

const filePath = path.join(`${__dirname}/pizzaTypes.json`);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9006;

app.get("/", (req, res) => {
  res.redirect(301, "/pizza/list");
});

app.get(["/pizza/list", "/pizza/list/:id"], async (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.get("/api/pizza", async function (req, res, next) {
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  setTimeout(() => {
    res.send(JSON.stringify(fileData.types));
  }, 0000);
});

app.get("/api/allergens", async (req, res) => {
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(JSON.stringify(fileData.allergens));
});

app.post("/api/order", async (req,res) => {
  const object = req.body
  const fileData = JSON.parse(await fileReaderAsync(`${__dirname}/orders.json`))
  object.id = fileData.orders.length + 1
  fileData.orders.push(object)
  fileWriterAsync(`${__dirname}/orders.json`, JSON.stringify(fileData, null, 4))
  res.send("Order was registered successful!")
})

app.listen(port, (_) => console.log(`http://127.0.0.1:${port}`));
